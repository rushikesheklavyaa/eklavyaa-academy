
import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { EnquiryFormData } from '../types';
import { submitEnquiry } from '../utils/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const initialFormState: EnquiryFormData = {
    studentName: '',
    parentName: '',
    grade: '',
    board: '',
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    message: ''
  };

  const [formData, setFormData] = useState<EnquiryFormData>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  // Store the full data for the WhatsApp message
  const [submittedData, setSubmittedData] = useState<EnquiryFormData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'grade') {
      // Reset board when grade changes
      setFormData(prev => ({ ...prev, [name]: value, board: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const success = await submitEnquiry(formData);
    
    if (success) {
      setSubmittedData({ ...formData }); // Capture full data
      setStatus('success');
      setFormData(initialFormState);
    } else {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setFormData(initialFormState);
    onClose();
  };

  const openWhatsApp = () => {
    if (!submittedData) return;
    const phoneNumber = '919011141618'; 
    
    // Construct a detailed message with all form fields
    const text = `Hello Eklavyaa Academy, I have just submitted an enquiry on your website.

*Student Details:*
Name: ${submittedData.studentName}
Class: ${submittedData.grade}
Board: ${submittedData.board}
School: ${submittedData.schoolName}
Parent: ${submittedData.parentName}
Phone: ${submittedData.phone}
Address: ${submittedData.address || 'N/A'}

Please share the coaching details and brochure.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const renderBoardOptions = () => {
    const isHigherSecondary = formData.grade === '11th Standard' || formData.grade === '12th Standard';
    
    if (isHigherSecondary) {
      return (
        <>
          <option value="Science">Science</option>
          <option value="Commerce">Commerce</option>
        </>
      );
    }
    
    return (
      <>
        <option value="SSC">SSC</option>
        <option value="CBSE">CBSE</option>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Admission Enquiry">
      {status === 'success' ? (
        <div className="text-center py-10 px-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-bold text-secondary-900 mb-2">Details Saved!</h4>
          <p className="text-slate-600 mb-6">
            Thank you for your enquiry. To get an immediate response and course brochure, please connect with us on WhatsApp.
          </p>
          
          <button 
              onClick={openWhatsApp}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-1 mb-4"
          >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
          </button>

          <Button 
            onClick={handleClose}
            className="w-full bg-secondary-900 hover:bg-secondary-800 text-white"
          >
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Something went wrong. Please check your internet connection.
                </div>
            )}
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="modal-studentName" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Student Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="modal-studentName"
                        name="studentName"
                        required
                        value={formData.studentName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none"
                        placeholder="Student's Full Name"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="modal-grade" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Class <span className="text-red-500">*</span></label>
                        <select
                            id="modal-grade"
                            name="grade"
                            required
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 outline-none"
                        >
                            <option value="">Select</option>
                            <option value="5th Standard">5th Standard</option>
                            <option value="6th Standard">6th Standard</option>
                            <option value="7th Standard">7th Standard</option>
                            <option value="8th Standard">8th Standard</option>
                            <option value="9th Standard">9th Standard</option>
                            <option value="10th Standard">10th Standard</option>
                            <option value="11th Standard">11th Standard</option>
                            <option value="12th Standard">12th Standard</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="modal-board" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Board / Stream <span className="text-red-500">*</span></label>
                        <select
                            id="modal-board"
                            name="board"
                            required
                            value={formData.board}
                            onChange={handleChange}
                            disabled={!formData.grade}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            <option value="" disabled>Select {formData.grade && (formData.grade === '11th Standard' || formData.grade === '12th Standard') ? 'Stream' : 'Board'}</option>
                            {renderBoardOptions()}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="modal-schoolName" className="block text-xs font-semibold text-slate-500 uppercase mb-1">School / College Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="modal-schoolName"
                        name="schoolName"
                        required
                        value={formData.schoolName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 outline-none"
                        placeholder="Current School or College"
                    />
                </div>

                <div>
                    <label htmlFor="modal-parentName" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Parent Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="modal-parentName"
                        name="parentName"
                        required
                        value={formData.parentName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 outline-none"
                        placeholder="Parent's Name"
                    />
                </div>

                <div>
                    <label htmlFor="modal-phone" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input
                        type="tel"
                        id="modal-phone"
                        name="phone"
                        required
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 outline-none"
                        placeholder="10-digit Mobile Number"
                    />
                </div>

                <div>
                    <label htmlFor="modal-address" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
                    <textarea
                        id="modal-address"
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 outline-none resize-none"
                        placeholder="Area, City"
                    />
                </div>
            </div>

            <div className="pt-4">
                <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? 'Saving...' : 'Submit Enquiry'}
                </Button>
            </div>
        </form>
      )}
    </Modal>
  );
};

export default EnquiryModal;
