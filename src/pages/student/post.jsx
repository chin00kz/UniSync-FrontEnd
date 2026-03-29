import React, { useState } from 'react';
import axios from 'axios';
import { 
  User, 
  MessageSquare, 
  Upload, 
  XCircle, 
  CheckCircle, 
  Loader2, 
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StudentPost({ onPostSuccess }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(user?.name || '');
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/sessions', {
        studentName: name,
        questionText: question,
        questionImage: image
      });
      if (onPostSuccess) onPostSuccess();
      navigate('/student/dashboard'); // Navigate back after success
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Check file size (Max 2MB)"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-brand-blue mb-4 transition-colors group"
        >
          <div className="size-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-brand-blue/5">
            <ArrowLeft className="size-4" />
          </div>
          Back
        </button>

        <div className="premium-card !p-0 overflow-hidden border-0 shadow-2xl">
          {/* Header Gradient - More Compact */}
          <div className="bg-brand-gradient p-6 text-white relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold flex items-center gap-3">
                <MessageSquare className="size-7" />
                New Question
              </h2>
              <p className="text-white/80 font-medium text-sm mt-0.5">Tell us what you're working on.</p>
            </div>
            {/* Minimal Decor */}
            <div className="absolute right-[-10px] top-[-10px] size-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              
              {/* Left Column: Details */}
              <div className="p-8 space-y-5 border-r border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <User className="size-4 text-brand-blue" />
                    Student Full Name
                  </label>
                  <input 
                    type="text" 
                    value={name} 
                    readOnly 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 font-medium text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="size-4 text-brand-blue" />
                    Your Question
                  </label>
                  <textarea 
                    placeholder="Explain your problem clearly..." 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none font-medium text-slate-700 min-h-[160px] resize-none bg-slate-50/30"
                  />
                </div>
              </div>

              {/* Right Column: Attachment & Action */}
              <div className="p-8 flex flex-col justify-between bg-slate-50/40">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ImageIcon className="size-4 text-brand-blue" />
                    Attachment (Optional)
                  </label>
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={(e) => { e.preventDefault(); processFile(e.dataTransfer.files[0]); }} 
                    className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-4 min-h-[180px] bg-white ${
                      image ? 'border-emerald-200 shadow-sm shadow-emerald-100' : 'border-slate-200 hover:border-brand-blue/30'
                    }`}
                  >
                    {!image ? (
                      <>
                        <div className="size-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue animate-pulse">
                          <Upload className="size-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-700">Drop files or <label htmlFor="file-upload" className="text-brand-blue cursor-pointer hover:underline">browse</label></p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Image files up to 2MB</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4 w-full">
                        <div className="relative group">
                          <img 
                            src={image} 
                            alt="Preview" 
                            className="size-24 rounded-xl object-cover border-2 border-emerald-500/20 shadow-md transition-transform group-hover:scale-105" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setImage("")} 
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:bg-rose-600 transition-colors"
                          >
                            <XCircle className="size-4" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="size-4" /> Image Ready
                        </p>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      id="file-upload" 
                      accept="image/*" 
                      onChange={(e) => processFile(e.target.files[0])} 
                      className="hidden" 
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white py-4 rounded-xl font-extrabold text-lg shadow-xl shadow-brand-blue/20 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Submit Question"
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentPost;
