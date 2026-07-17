import { useRef, useState } from 'react';
import { confirmAttendance, markAttendance } from '../api/nodeApi';

function formatConfidence(student) {
  const score = student.similarity ?? student.confidence;
  if (typeof score !== 'number') return 'No score';
  const percent = score <= 1 ? score * 100 : score;
  return `${percent.toFixed(1)}% confidence`;
}

function AttendanceForm() {
  const EMPTY = { course: '', image: null };
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [manualStudent, setManualStudent] = useState({ name: '', enrollment_number: '' });
  const [pendingAttendance, setPendingAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const submittingRef = useRef(false);
  const confirmingRef = useRef(false);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current || loading) return;
    if (!form.image) { setMessage('Class photo is required'); setMessageType('error'); return; }

    submittingRef.current = true;
    setLoading(true);
    setMatchedStudents([]);
    setPendingAttendance(null);
    setMessage('Detecting faces and preparing matches for review...');
    setMessageType('info');

    try {
      const fd = new FormData();
      fd.append('course', form.course || 'General');
      fd.append('image', form.image);

      const res = await markAttendance(fd);
      const result = res?.data || {};
      const students = Array.isArray(result?.matched_students)
        ? result.matched_students.map((student, index) => ({
            ...student,
            face_index: student.face_index ?? index,
            confirmed: true,
            manual: false,
          }))
        : [];

      setMatchedStudents(students);
      setPendingAttendance({ image: result.image, course: result.course || form.course || 'General' });

      if (students.length > 0) {
        setMessage(`Review ${students.length} detected face match(es), then confirm attendance.`);
        setMessageType('success');
      } else {
        setMessage(result?.message || 'No registered students matched this class photo. Add students manually if needed.');
        setMessageType('error');
      }
      setForm(EMPTY);
    } catch (err) {
      setMessage(err.message || 'Failed to process attendance image.');
      setMessageType('error');
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const toggleStudent = (faceIndex) => {
    setMatchedStudents((students) => students.map((student) => (
      student.face_index === faceIndex ? { ...student, confirmed: !student.confirmed } : student
    )));
  };

  const addManualStudent = () => {
    if (!manualStudent.name.trim() || !manualStudent.enrollment_number.trim()) {
      setMessage('Enter a name and enrollment ID before adding a manual student.');
      setMessageType('error');
      return;
    }

    setMatchedStudents((students) => [
      ...students,
      {
        ...manualStudent,
        face_index: `manual-${Date.now()}`,
        confidence: null,
        similarity: null,
        bounding_box: null,
        face_crop: null,
        confirmed: true,
        manual: true,
      },
    ]);
    setManualStudent({ name: '', enrollment_number: '' });
    setMessage('Manual student added to the confirmation list.');
    setMessageType('success');
  };

  const onConfirmAttendance = async () => {
    if (confirmingRef.current || confirming) return;
    const selectedStudents = matchedStudents.filter((student) => student.confirmed);
    if (!pendingAttendance?.image) {
      setMessage('Upload and process a class photo before confirming attendance.');
      setMessageType('error');
      return;
    }
    if (selectedStudents.length === 0) {
      setMessage('Select at least one student to confirm attendance.');
      setMessageType('error');
      return;
    }

    confirmingRef.current = true;
    setConfirming(true);
    setMessage('Confirming attendance records...');
    setMessageType('info');

    try {
      const res = await confirmAttendance({
        ...pendingAttendance,
        students: selectedStudents,
      });
      setMessage(res?.message || `Attendance confirmed for ${selectedStudents.length} student(s).`);
      setMessageType('success');
      setMatchedStudents([]);
      setPendingAttendance(null);
    } catch (err) {
      setMessage(err.message || 'Failed to confirm attendance.');
      setMessageType('error');
    } finally {
      confirmingRef.current = false;
      setConfirming(false);
    }
  };

  const selectedCount = matchedStudents.filter((student) => student.confirmed).length;

  return (
    <section className="panel">
      <h2>Mark Class Attendance</h2>
      <p className="helper-text">
        Upload a classroom or group photo to detect possible matches. Review every face, uncheck incorrect guesses, add missed students manually, then confirm to write attendance records.
      </p>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Course / Class</label>
            <input name="course" placeholder="Computer Science" value={form.course} onChange={onChange} />
          </div>
          <div className="field">
            <label>Class Photo</label>
            <input name="image" type="file" accept="image/*" onChange={onChange} required />
          </div>
        </div>
        <div className="button-row">
          <button className="primary-btn" type="submit" disabled={loading || confirming}>
            {loading ? 'Detecting...' : 'Detect Faces'}
          </button>
        </div>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
      {pendingAttendance && (
        <div className="results-list attendance-review">
          <div className="review-heading">
            <div>
              <h3>Review detected students</h3>
              <p>{selectedCount} selected for attendance</p>
            </div>
            <button className="primary-btn" type="button" onClick={onConfirmAttendance} disabled={confirming || selectedCount === 0}>
              {confirming ? 'Confirming...' : 'Confirm Attendance'}
            </button>
          </div>

          {matchedStudents.length > 0 && (
            <div className="match-grid">
              {matchedStudents.map((student) => (
                <label className="match-card" key={student.face_index}>
                  <input type="checkbox" checked={student.confirmed} onChange={() => toggleStudent(student.face_index)} />
                  <div className="face-crop">
                    {student.face_crop ? <img src={student.face_crop} alt={`${student.name} detected face`} /> : <span>{student.manual ? 'Manual' : 'No crop'}</span>}
                  </div>
                  <div>
                    <strong>{student.name}</strong>
                    <span>{student.enrollment_number || 'No enrollment ID'}</span>
                    <small>{student.manual ? 'Added manually' : formatConfidence(student)}</small>
                    {student.bounding_box && <small>Box: {JSON.stringify(student.bounding_box)}</small>}
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="manual-add">
            <h4>Add missed student</h4>
            <div className="form-grid">
              <div className="field">
                <label>Student Name</label>
                <input value={manualStudent.name} onChange={(e) => setManualStudent((p) => ({ ...p, name: e.target.value }))} placeholder="Student name" />
              </div>
              <div className="field">
                <label>Enrollment ID</label>
                <input value={manualStudent.enrollment_number} onChange={(e) => setManualStudent((p) => ({ ...p, enrollment_number: e.target.value }))} placeholder="ENR-2026-01" />
              </div>
            </div>
            <button className="secondary-btn" type="button" onClick={addManualStudent}>Add Student</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AttendanceForm;
