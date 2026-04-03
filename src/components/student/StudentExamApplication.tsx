import { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, BookOpen, X } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, Exam } from '../../lib/storage';

export function StudentExamApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExams, setSelectedExams] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelExamId, setCancelExamId] = useState<number | null>(null);

  const [availableExams, setAvailableExams] = usePersistence<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_DATA.EXAMS);
  const [appliedExams, setAppliedExams] = usePersistence<Exam[]>(STORAGE_KEYS.STUDENT_APPLICATIONS, INITIAL_DATA.STUDENT_APPLICATIONS);

  const handleExamToggle = (examId: number) => {
    setSelectedExams(prev =>
      prev.includes(examId)
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedExams.length === 0) {
      toast.error('Please select at least one exam to continue');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const selectedExamObjects = availableExams.filter(exam => selectedExams.includes(exam.id));
    const newAppliedExams = selectedExamObjects.map(exam => ({
      ...exam,
      status: 'confirmed' as const,
      applicationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));

    setAppliedExams([...appliedExams, ...newAppliedExams]);
    setAvailableExams(availableExams.filter(exam => !selectedExams.includes(exam.id)));

    setShowConfirmModal(false);
    toast.success(`Successfully applied for ${selectedExams.length} exam${selectedExams.length > 1 ? 's' : ''}!`);
    setSelectedExams([]);
    setCurrentStep(1);
  };

  const handleCancelApplication = () => {
    if (cancelExamId !== null) {
      const examToCancel = appliedExams.find(e => e.id === cancelExamId);
      if (examToCancel) {
        setAvailableExams([...availableExams, { ...examToCancel, status: undefined, applicationDate: undefined }]);
        setAppliedExams(appliedExams.filter(e => e.id !== cancelExamId));
      }
    }
    toast.success('Exam application cancelled successfully');
    setShowCancelModal(false);
    setCancelExamId(null);
  };

  const getSelectedExamDetails = () => {
    return availableExams.filter(exam => selectedExams.includes(exam.id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Apply for Exams</h1>
        <p className="text-gray-600">Select and apply for upcoming examinations</p>
      </div>

      {/* Wizard Steps Indicator */}
      <Card>
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'}
                `}>
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <div className="hidden md:block">
                  <p className={`${currentStep >= step ? 'text-blue-600' : 'text-gray-600'}`}>
                    {step === 1 && 'Select Exams'}
                    {step === 2 && 'Review Details'}
                    {step === 3 && 'Confirm'}
                  </p>
                </div>
              </div>
              {index < 2 && (
                <div className={`flex-1 h-1 mx-4 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card title="Step 1: Select Exams">
          <p className="text-gray-600 mb-4">
            Select the exams you wish to apply for. You can select multiple exams at once.
          </p>
          <div className="space-y-4">
            {availableExams.map(exam => (
              <div
                key={exam.id}
                className={`
                  border-2 rounded-lg p-4 cursor-pointer transition-all
                  ${selectedExams.includes(exam.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
                onClick={() => handleExamToggle(exam.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-gray-900">{exam.course}</h4>
                      <span className={`px-2 py-1 rounded text-sm ${exam.type === 'Final'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {exam.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{exam.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{exam.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{exam.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{exam.professor}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${selectedExams.includes(exam.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'}
                  `}>
                    {selectedExams.includes(exam.id) && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-gray-600">
              {selectedExams.length} exam{selectedExams.length !== 1 ? 's' : ''} selected
            </p>
            <Button onClick={handleNext} disabled={selectedExams.length === 0}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 2 && (
        <Card title="Step 2: Review Details">
          <p className="text-gray-600 mb-4">
            Review the exams you've selected. Make sure all information is correct.
          </p>
          <div className="space-y-4">
            {getSelectedExamDetails().map(exam => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-gray-900 mb-1">{exam.course}</h4>
                    <span className={`px-2 py-1 rounded text-sm ${exam.type === 'Final'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {exam.type} Exam
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span><strong>Date:</strong> {exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span><strong>Time:</strong> {exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span><strong>Location:</strong> {exam.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span><strong>Professor:</strong> {exam.professor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={handleNext}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 3 && (
        <Card title="Step 3: Confirm Application">
          <div className="text-center py-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Confirm Your Application</h3>
            <p className="text-gray-600 mb-6">
              You are about to apply for {selectedExams.length} exam{selectedExams.length !== 1 ? 's' : ''}.
              This action will register you for the selected examinations.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="mb-1">Important Notes:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>You must arrive 15 minutes before the exam starts</li>
                    <li>Bring your student ID card</li>
                    <li>Applications can be cancelled up to 48 hours before the exam</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button variant="success" onClick={() => setShowConfirmModal(true)} fullWidth>
              <CheckCircle className="w-4 h-4" /> Confirm Application
            </Button>
          </div>
        </Card>
      )}

      {/* Applied Exams Section */}
      <Card title="Your Applied Exams">
        <p className="text-gray-600 mb-4">
          Exams you have already applied for. You can cancel your application up to 48 hours before the exam.
        </p>
        {appliedExams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>You haven't applied for any exams yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appliedExams.map(exam => (
              <div key={exam.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-gray-900">{exam.course}</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                        {exam.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{exam.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{exam.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{exam.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>Applied: {exam.applicationDate}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setCancelExamId(exam.id);
                      setShowCancelModal(true);
                    }}
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Exam Application"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Go Back
            </Button>
            <Button variant="success" onClick={handleSubmit}>
              Confirm & Submit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to submit your application for the following exams?
          </p>
          <div className="space-y-2">
            {getSelectedExamDetails().map(exam => (
              <div key={exam.id} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900">{exam.course}</p>
                <p className="text-sm text-gray-600">{exam.date} at {exam.time}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Cancel Application Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelExamId(null);
        }}
        title="Cancel Exam Application"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowCancelModal(false);
              setCancelExamId(null);
            }}>
              Keep Application
            </Button>
            <Button variant="danger" onClick={handleCancelApplication}>
              Yes, Cancel Application
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel your exam application? This action cannot be undone.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p>You will need to reapply if you change your mind.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
