import React, { useState, useEffect, useRef } from 'react';
import { loadData, saveData } from './services/storage';
import { sendMessageToGemini } from './services/gemini';
import { AppData, ViewState, Student, GalleryItem } from './types';
import ClockWidget from './components/ClockWidget';
import * as Icons from './components/Icons';

// --- Helper Component: Image Upload ---
const ImageUploadInput: React.FC<{ 
  currentImage: string, 
  onImageChange: (base64: string) => void,
  label?: string
}> = ({ currentImage, onImageChange, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to ~2MB to prevent localStorage quota exceeded)
      if (file.size > 2 * 1024 * 1024) {
        alert("Rasm hajmi juda katta! Iltimos, 2MB dan kichik rasm yuklang.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
           <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            accept="image/*"
            className="hidden"
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Icons.Upload size={18} />
            <span>Rasmni yuklash</span>
          </button>
          <p className="text-xs text-slate-400 mt-1">Galereyadan tanlang (max 2MB)</p>
        </div>
      </div>
    </div>
  );
};

// 1. Home View
const HomeView: React.FC<{ data: AppData }> = ({ data }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        <img 
          src={data.config.heroImage} 
          alt="Class Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex flex-col items-center justify-end pb-16 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl animate-float-text tracking-tight">
            {data.config.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-medium italic max-w-2xl bg-blue-900/30 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30">
            "{data.config.motto}"
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 border-l-4 border-blue-600 flex items-start gap-4 hover:transform hover:-translate-y-1 transition-all">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Icons.MapPin size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">Manzil</h3>
            <p className="text-lg font-bold text-slate-800">{data.config.location}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 border-l-4 border-sky-500 flex items-start gap-4 hover:transform hover:-translate-y-1 transition-all">
          <div className="bg-sky-100 p-3 rounded-full text-sky-600">
            <Icons.Calendar size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">Oxirgi Tadbir</h3>
            <p className="text-lg font-bold text-slate-800">{data.config.lastEvent}</p>
            <p className="text-sm text-sky-600 font-medium">{data.config.lastEventDate}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg shadow-blue-100 border-l-4 border-indigo-500 flex items-center justify-between hover:transform hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <Icons.Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">Hozirgi Vaqt</h3>
               <div className="mt-1"><ClockWidget /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. People View
const PeopleView: React.FC<{ data: AppData }> = ({ data }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-blue-900">Bizning Jamoa</h2>
      
      {/* Teacher Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-blue-100">
        <div className="md:w-1/3 h-64 md:h-auto relative">
          <img src={data.teacher.photoUrl} alt="Teacher" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent md:hidden"></div>
        </div>
        <div className="p-8 md:w-2/3 flex flex-col justify-center bg-gradient-to-r from-white to-blue-50">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-bold mb-1">Sinf Rahbari</div>
          <h3 className="block mt-1 text-3xl leading-tight font-extrabold text-slate-900">{data.teacher.name}</h3>
          <p className="mt-2 text-slate-600 font-medium">{data.teacher.subject} o'qituvchisi</p>
          <div className="mt-6 flex items-center gap-3 text-slate-700 bg-white p-3 rounded-lg shadow-sm w-fit">
             <Icons.Phone size={18} className="text-blue-500" />
             <span className="font-mono font-semibold">{data.teacher.phone}</span>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b border-blue-200 pb-2 pl-2 border-l-4 border-l-blue-600">O'quvchilar</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.students.map((student) => (
            <div key={student.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100">
              <div className="h-48 overflow-hidden bg-slate-200">
                <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-4 text-center">
                <h4 className="font-bold text-lg text-slate-900 truncate">{student.name}</h4>
                <p className="text-sm text-blue-600 font-medium uppercase tracking-wider text-[10px] mt-1">{student.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Gallery View
const GalleryView: React.FC<{ data: AppData }> = ({ data }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-4">
        <h2 className="text-3xl font-bold text-blue-900">Sinf Galereyasi</h2>
        <div className="h-1 w-20 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        <p className="text-slate-500 mt-2">Bizning eng yorqin xotiralarimiz</p>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {data.gallery.map((item) => (
          <div key={item.id} className="group relative break-inside-avoid overflow-hidden rounded-2xl shadow-lg cursor-pointer border-2 border-white">
            <img 
              src={item.imageUrl} 
              alt={item.caption} 
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <p className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.caption}</p>
              <div className="flex items-center gap-2 mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                <Icons.Calendar size={14} className="text-blue-300" />
                <p className="text-blue-200 text-sm">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. AI Chat View
const AIChatView: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Salom! Men 9-B sinfining virtual yordamchisiman. Menga istalgan savolingizni bering!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await sendMessageToGemini(userMsg, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: response || "Xatolik yuz berdi." }]);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100 animate-fade-in">
      <div className="bg-blue-700 p-4 flex items-center gap-3 text-white shadow-md">
        <div className="bg-white/20 p-2 rounded-full">
           <Icons.MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Sinf AI Yordamchisi</h3>
          <p className="text-xs text-blue-200 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-slate-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-none animate-pulse text-sm">
              AI o'ylamoqda...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Savolingizni yozing..."
          className="flex-1 p-3 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white p-3 px-6 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md font-medium"
        >
          Yuborish
        </button>
      </form>
    </div>
  );
};

// 5. Admin Panel View
const AdminView: React.FC<{ 
  data: AppData, 
  onSave: (newData: AppData) => void 
}> = ({ data, onSave }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'students' | 'teacher' | 'gallery'>('general');
  const [tempData, setTempData] = useState<AppData>(data);

  // Sync temp data if props update
  useEffect(() => {
    setTempData(data);
  }, [data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === 'Abulfayz1' && loginPass === 'Shodiyev2') {
      setIsAuthenticated(true);
    } else {
      alert("Login yoki parol noto'g'ri!");
    }
  };

  const saveChanges = () => {
    onSave(tempData);
    alert("O'zgarishlar saqlandi!");
  };

  const handleConfigChange = (key: keyof typeof tempData.config, value: string) => {
    setTempData(prev => ({ ...prev, config: { ...prev.config, [key]: value } }));
  };

  const handleTeacherChange = (key: keyof typeof tempData.teacher, value: string) => {
    setTempData(prev => ({ ...prev, teacher: { ...prev.teacher, [key]: value } }));
  };

  const updateStudent = (id: string, field: keyof Student, value: string) => {
    setTempData(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const deleteStudent = (id: string) => {
    setTempData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id)
    }));
  };

  const addStudent = () => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name: "Yangi O'quvchi",
      role: "O'quvchi",
      photoUrl: "https://picsum.photos/200/200"
    };
    setTempData(prev => ({ ...prev, students: [...prev.students, newStudent] }));
  };

  const deleteGalleryItem = (id: string) => {
    setTempData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(g => g.id !== id)
    }));
  };

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      imageUrl: "https://picsum.photos/800/600",
      caption: "Yangi rasm",
      date: new Date().toLocaleDateString()
    };
    setTempData(prev => ({ ...prev, gallery: [...prev.gallery, newItem] }));
  };

  const updateGalleryItem = (id: string, field: keyof GalleryItem, value: string) => {
    setTempData(prev => ({
      ...prev,
      gallery: prev.gallery.map(g => g.id === id ? { ...g, [field]: value } : g)
    }));
  };


  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border-t-4 border-blue-600">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-blue-900">Admin Kirish</h2>
            <p className="text-slate-500">Tahrirlash uchun tizimga kiring</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Login</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parol</label>
            <input 
              type="password" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
              value={loginPass}
              onChange={e => setLoginPass(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
            Kirish
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] animate-fade-in border border-slate-200">
      <div className="flex border-b overflow-x-auto">
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex-1 p-4 font-medium whitespace-nowrap ${activeTab === 'general' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-500'}`}
        >
          Umumiy & Footer
        </button>
        <button 
          onClick={() => setActiveTab('teacher')}
          className={`flex-1 p-4 font-medium whitespace-nowrap ${activeTab === 'teacher' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-500'}`}
        >
          O'qituvchi
        </button>
        <button 
          onClick={() => setActiveTab('students')}
          className={`flex-1 p-4 font-medium whitespace-nowrap ${activeTab === 'students' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-500'}`}
        >
          O'quvchilar
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 p-4 font-medium whitespace-nowrap ${activeTab === 'gallery' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-500'}`}
        >
          Galereya
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Tahrirlash</h2>
          <button onClick={saveChanges} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-md transition-transform hover:scale-105">
            <Icons.Save size={18} /> Saqlash
          </button>
        </div>

        {activeTab === 'general' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-blue-700 mb-3 border-b pb-2">Asosiy Qism</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bosh sahifa sarlavhasi</label>
                  <input type="text" value={tempData.config.heroTitle} onChange={(e) => handleConfigChange('heroTitle', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Shior</label>
                  <input type="text" value={tempData.config.motto} onChange={(e) => handleConfigChange('motto', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                
                <ImageUploadInput 
                  label="Banner Rasmi"
                  currentImage={tempData.config.heroImage}
                  onImageChange={(base64) => handleConfigChange('heroImage', base64)}
                />

                <div>
                  <label className="block text-sm font-medium mb-1">Manzil</label>
                  <input type="text" value={tempData.config.location} onChange={(e) => handleConfigChange('location', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Oxirgi Tadbir</label>
                    <input type="text" value={tempData.config.lastEvent} onChange={(e) => handleConfigChange('lastEvent', e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sana</label>
                    <input type="text" value={tempData.config.lastEventDate} onChange={(e) => handleConfigChange('lastEventDate', e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-blue-700 mb-3 border-b pb-2">Footer (Pastki qism) Sozlamalari</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Muallif Ismi</label>
                  <input type="text" value={tempData.config.creatorName} onChange={(e) => handleConfigChange('creatorName', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <input type="text" value={tempData.config.creatorPhone} onChange={(e) => handleConfigChange('creatorPhone', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                   <h4 className="text-sm font-semibold text-slate-600 mt-2">Ijtimoiy Tarmoqlar Linklari</h4>
                   <div className="flex items-center gap-2">
                      <Icons.Send size={16} className="text-blue-400"/>
                      <input placeholder="Telegram Link" type="text" value={tempData.config.telegramLink} onChange={(e) => handleConfigChange('telegramLink', e.target.value)} className="flex-1 p-2 border rounded text-sm" />
                   </div>
                   <div className="flex items-center gap-2">
                      <Icons.Instagram size={16} className="text-pink-500"/>
                      <input placeholder="Instagram Link" type="text" value={tempData.config.instagramLink} onChange={(e) => handleConfigChange('instagramLink', e.target.value)} className="flex-1 p-2 border rounded text-sm" />
                   </div>
                   <div className="flex items-center gap-2">
                      <Icons.Youtube size={16} className="text-red-500"/>
                      <input placeholder="YouTube Link" type="text" value={tempData.config.youtubeLink} onChange={(e) => handleConfigChange('youtubeLink', e.target.value)} className="flex-1 p-2 border rounded text-sm" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teacher' && (
           <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-1">Ism Familiya</label>
              <input type="text" value={tempData.teacher.name} onChange={(e) => handleTeacherChange('name', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fan</label>
              <input type="text" value={tempData.teacher.subject} onChange={(e) => handleTeacherChange('subject', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefon</label>
              <input type="text" value={tempData.teacher.phone} onChange={(e) => handleTeacherChange('phone', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            
            <ImageUploadInput 
              label="O'qituvchi Rasmi"
              currentImage={tempData.teacher.photoUrl}
              onImageChange={(base64) => handleTeacherChange('photoUrl', base64)}
            />
           </div>
        )}

        {activeTab === 'students' && (
          <div>
            <button onClick={addStudent} className="mb-4 flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition">
              <Icons.Plus size={18} /> Yangi o'quvchi qo'shish
            </button>
            <div className="space-y-4">
              {tempData.students.map((student) => (
                <div key={student.id} className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-lg bg-slate-50 hover:bg-white transition shadow-sm">
                  <div className="shrink-0">
                    <ImageUploadInput 
                      currentImage={student.photoUrl} 
                      onImageChange={(base64) => updateStudent(student.id, 'photoUrl', base64)} 
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div>
                      <label className="text-xs text-slate-500">Ism</label>
                      <input 
                        type="text" 
                        value={student.name} 
                        onChange={(e) => updateStudent(student.id, 'name', e.target.value)} 
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Rol</label>
                      <input 
                        type="text" 
                        value={student.role} 
                        onChange={(e) => updateStudent(student.id, 'role', e.target.value)} 
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <button onClick={() => deleteStudent(student.id)} className="text-red-500 p-2 hover:bg-red-50 rounded bg-white border border-red-100 self-end md:self-center">
                    <Icons.Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <button onClick={addGalleryItem} className="mb-4 flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition">
              <Icons.Plus size={18} /> Rasm qo'shish
            </button>
            <div className="grid grid-cols-1 gap-6">
              {tempData.gallery.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-lg bg-slate-50">
                   <div className="shrink-0">
                      <ImageUploadInput 
                        currentImage={item.imageUrl} 
                        onImageChange={(base64) => updateGalleryItem(item.id, 'imageUrl', base64)} 
                      />
                   </div>
                   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div>
                      <label className="text-xs text-slate-500">Izoh</label>
                      <input 
                        type="text" 
                        value={item.caption} 
                        onChange={(e) => updateGalleryItem(item.id, 'caption', e.target.value)} 
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Sana</label>
                      <input 
                        type="text" 
                        value={item.date} 
                        onChange={(e) => updateGalleryItem(item.id, 'date', e.target.value)} 
                        className="w-full p-2 border rounded"
                      />
                    </div>
                   </div>
                   <button onClick={() => deleteGalleryItem(item.id)} className="text-red-500 p-2 hover:bg-red-50 rounded bg-white border border-red-100 self-end md:self-center">
                    <Icons.Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Main App Component Logic
function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [view, setView] = useState<ViewState>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
  }, []);

  const handleSaveData = (newData: AppData) => {
    setData(newData);
    saveData(newData);
  };

  if (!data) return <div className="flex items-center justify-center h-screen bg-blue-50 text-blue-600 font-bold">Yuklanmoqda...</div>;

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setView(target);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        view === target 
          ? 'bg-blue-600 text-white shadow-md transform scale-105' 
          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setView('home')}
            >
              {/* Animated Logo Container */}
              <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                 <Icons.GraduationCap className="text-white w-6 h-6 animate-swing" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight group-hover:text-blue-600 transition-colors">
                  9-B Sinf
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavItem target="home" icon={Icons.Home} label="Bosh Sahifa" />
              <NavItem target="people" icon={Icons.Users} label="Jamoa" />
              <NavItem target="gallery" icon={Icons.Image} label="Galereya" />
              <NavItem target="chat" icon={Icons.MessageSquare} label="AI Chat" />
              <NavItem target="admin" icon={Icons.Settings} label="Admin" />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-2 shadow-lg absolute w-full z-50">
            <NavItem target="home" icon={Icons.Home} label="Bosh Sahifa" />
            <NavItem target="people" icon={Icons.Users} label="Jamoa" />
            <NavItem target="gallery" icon={Icons.Image} label="Galereya" />
            <NavItem target="chat" icon={Icons.MessageSquare} label="AI Chat" />
            <NavItem target="admin" icon={Icons.Settings} label="Admin" />
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {view === 'home' && <HomeView data={data} />}
        {view === 'people' && <PeopleView data={data} />}
        {view === 'gallery' && <GalleryView data={data} />}
        {view === 'chat' && <AIChatView />}
        {view === 'admin' && <AdminView data={data} onSave={handleSaveData} />}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white pt-10 pb-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            
            {/* Brand */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4 group">
                <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Icons.GraduationCap className="text-white w-6 h-6 animate-swing" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">9-B Sinf</span>
              </div>
              <p className="text-blue-200 text-sm">Bizning sinfimizning raqamli uyi. <br/>Ilm, do'stlik va kelajak sari.</p>
            </div>

            {/* Creator Info */}
            <div>
              <h4 className="font-bold text-lg mb-4">Yaratuvchi</h4>
              <div className="space-y-2 text-blue-100">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <Icons.User size={16} /> {data.config.creatorName}
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <Icons.Phone size={16} /> {data.config.creatorPhone}
                </p>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="font-bold text-lg mb-4">Bizni Kuzating</h4>
              <div className="flex justify-center md:justify-start gap-4">
                <a href={data.config.telegramLink} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Icons.Send size={20} className="text-white" />
                </a>
                <a href={data.config.instagramLink} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Icons.Instagram size={20} className="text-white" />
                </a>
                <a href={data.config.youtubeLink} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors">
                  <Icons.Youtube size={20} className="text-white" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 pt-6 text-center text-blue-400 text-sm">
            <p>© {new Date().getFullYear()} 9-B Sinf. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;