import React, { useState } from 'react';
import Section from './ui/Section';
import Button from './ui/Button';
import { Send, CheckCircle, Phone, Mail, AlertCircle, MessageCircle } from 'lucide-react';
import { EnquiryFormData } from '../types';
import { submitEnquiry } from '../utils/api';

const EnquiryForm: React.FC = () => {
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
  // Store the full data for the WhatsApp message after form is cleared
  const [submittedData, setSubmittedData] = useState<EnquiryFormData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'grade') {
      // Reset board when grade changes to ensure valid options are selected
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
      setSubmittedData({ ...formData }); // Capture full data before clearing
      setStatus('success');
      setFormData(initialFormState); // Clear form on success
    } else {
      setStatus('error');
    }
  };

  const openWhatsApp = () => {
    if (!submittedData) return;
    const phoneNumber = '919011141618'; // Using the first number from your footer
    
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
        <option value="SSC">SSC (State Board)</option>
        <option value="CBSE">CBSE</option>
      </>
    );
  };

  return (
    <Section id="enquiry" bg="white">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="grid md:grid-cols-5">
            {/* Contact Info Sidebar */}
            <div className="md:col-span-2 bg-secondary-900 p-8 text-white flex flex-col justify-between">
                <div>
                    <h3 className="text-3xl font-bold leading-tight mb-4">
                        Take the First Step to <span className="text-primary-500 font-serif italic">Excellence</span>
                    </h3>
                    <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                        Fill out our admission enquiry form and our academic counselor will help you choose the right path for your academic future.
                    </p>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                            <span>Free Counseling Session</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                            <span>Scholarship Info</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                            <span>Demo Lectures</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                     <div className="text-primary-400 font-bold tracking-widest text-xs uppercase mb-3">Call Us</div>
                     <div className="flex flex-col gap-2">
                        <a href="tel:9011141618" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                            <Phone className="w-4 h-4" /> 9011141618
                        </a>
                        <a href="tel:9022781871" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                            <Phone className="w-4 h-4" /> 9022781871
                        </a>
                        <a href="tel:7666076709" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                            <Phone className="w-4 h-4" /> 7666076709
                        </a>
                     </div>
                     
                     <div className="text-primary-400 font-bold tracking-widest text-xs uppercase mb-2 mt-6">Email Us</div>
                     <a href="mailto:enquiry.eklavyaa@gmail.com" className="flex items-center gap-2 text-sm hover:text-primary-400 transition-colors break-words">
                        <Mail className="w-4 h-4 shrink-0" /> enquiry.eklavyaa@gmail.com
                     </a>
                </div>
            </div>

            {/* Form Area */}
            <div className="md:col-span-3 p-8 lg:p-10 relative">
                {status === 'success' ? (
                    <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h4 className="text-2xl font-bold text-secondary-900 mb-2">Enquiry Submitted!</h4>
                        <p className="text-slate-600 mb-6 max-w-xs mx-auto">
                            Thank you. We have received your details. Click below to confirm your enquiry on WhatsApp and get the brochure.
                        </p>
                        
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                          <button 
                              onClick={openWhatsApp}
                              className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-1"
                          >
                              <MessageCircle className="w-5 h-5" />
                              Get Details on WhatsApp
                          </button>
                          
                          <Button 
                              variant="outline" 
                              onClick={() => setStatus('idle')}
                              className="w-full"
                          >
                              Submit Another Enquiry
                          </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status === 'error' && (
                           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                              <AlertCircle className="w-4 h-4" />
                              Unable to submit. Please check your connection or call us directly.
                           </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="studentName" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Student Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="studentName"
                                    name="studentName"
                                    required
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all"
                                    placeholder="Enter student name"
                                />
                            </div>
                            <div>
                                <label htmlFor="parentName" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Parent Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="parentName"
                                    name="parentName"
                                    required
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all"
                                    placeholder="Enter parent name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="grade" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Class/Standard <span className="text-red-500">*</span></label>
                                <select
                                    id="grade"
                                    name="grade"
                                    required
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all"
                                >
                                    <option value="" disabled>Select Class</option>
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
                                <label htmlFor="board" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Board / Stream <span className="text-red-500">*</span></label>
                                <select
                                    id="board"
                                    name="board"
                                    required
                                    value={formData.board}
                                    onChange={handleChange}
                                    disabled={!formData.grade}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                    <option value="" disabled>Select {formData.grade && (formData.grade === '11th Standard' || formData.grade === '12th Standard') ? 'Stream' : 'Board'}</option>
                                    {renderBoardOptions()}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="schoolName" className="block text-xs font-semibold text-slate-500 uppercase mb-1">School / College Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="schoolName"
                                name="schoolName"
                                required
                                value={formData.schoolName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all"
                                placeholder="Enter current school or college name"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all"
                                    placeholder="10-digit mobile number"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email (Optional)</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                rows={2}
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all resize-none"
                                placeholder="Your Area, City"
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-xs font-semibold text-slate-500 uppercase mb-1">Message / Question</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={2}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-secondary-900 focus:ring-1 focus:ring-secondary-900 outline-none transition-all resize-none"
                                placeholder="Any specific requirements?"
                            ></textarea>
                        </div>

                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Submitting...' : 'Submit Enquiry'}
                                {!status.includes('submitting') && <Send className="ml-2 w-4 h-4" />}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </Section>
  );
};

export default EnquiryForm;