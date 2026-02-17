import React, { useState, useEffect, useRef, useCallback } from "react";
import { format, parse, differenceInSeconds } from "date-fns";
import { 
  Search, MapPin, Moon, Sun, Calendar, 
  Clock, ChevronDown, Loader, X, ExternalLink, Code 
} from "lucide-react";

const Ramadan = () => {
  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selection & Search State
  const [selectedDistrict, setSelectedDistrict] = useState("natore");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Time & Logic State
  const [todayData, setTodayData] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [nextEvent, setNextEvent] = useState(null);
  
  // Refs
  const dropdownRef = useRef(null);

  // 1. Fetch Data
  useEffect(() => {
    fetch("/ramadan_data.json")
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // 2. Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. SMART SCHEDULER
  const updateSchedule = useCallback(() => {
    if (!data || !data.schedule[selectedDistrict]) return;

    const now = new Date();
    const districtSchedule = data.schedule[selectedDistrict] || [];
    
    const todayStr = format(now, "yyyy-MM-dd");
    let currentDayRecord = districtSchedule.find((d) => d.date === todayStr);
    
    let foundEvent = null;

    for (let day of districtSchedule) {
      const sehriTime = parse(`${day.date} ${day.sehri}`, "yyyy-MM-dd hh:mm a", new Date());
      const iftarTime = parse(`${day.date} ${day.iftar}`, "yyyy-MM-dd hh:mm a", new Date());

      if (now < sehriTime) {
        foundEvent = { 
          type: "sehri", 
          time: sehriTime, 
          label: "সেহরির শেষ সময় বাকি",
          dayData: day 
        };
        if (day.date !== todayStr) currentDayRecord = day;
        break;
      }
      
      if (now < iftarTime) {
        foundEvent = { 
          type: "iftar", 
          time: iftarTime, 
          label: "ইফতারের সময় বাকি",
          dayData: day 
        };
        currentDayRecord = day;
        break;
      }
    }

    setTodayData(currentDayRecord || null);
    setNextEvent(foundEvent);

  }, [data, selectedDistrict]);

  useEffect(() => {
    updateSchedule();
  }, [updateSchedule]);

  // 4. Timer Logic
  useEffect(() => {
    if (!nextEvent || !nextEvent.time) return;

    const calculateTime = () => {
      const now = new Date();
      const diff = differenceInSeconds(nextEvent.time, now);

      if (diff <= 0) {
        setTimeLeft("00 : 00 : 00");
        setTimeout(() => updateSchedule(), 1000);
        return false;
      }

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      const formatNum = (num) => num.toString().padStart(2, "0");
      setTimeLeft(`${formatNum(h)} : ${formatNum(m)} : ${formatNum(s)}`);
      return true;
    };

    calculateTime();
    const timer = setInterval(() => {
      const shouldContinue = calculateTime();
      if (!shouldContinue) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent, updateSchedule]);

  // Search Logic
  const filteredDistricts = data?.districts.filter(d => 
    d.bnName.includes(searchQuery) || d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentDistrictName = data?.districts.find(d => d.id === selectedDistrict)?.bnName;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader className="animate-spin text-emerald-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden flex flex-col">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 relative z-10 flex-grow w-full">
        
        {/* --- Header Dashboard Bar --- */}
        <header className="relative z-50 flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
              {/* Logo Image Placeholder - Replace src with your favicon path if needed */}
              <Moon className="text-emerald-400 w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Ramadan <span className="text-emerald-400">2026</span></h1>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wide uppercase">Sehri & Iftar Time</p>
            </div>
          </div>

          {/* Searchable Dropdown */}
          <div className="relative w-full md:w-72" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 text-white py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-sm truncate">{currentDistrictName || "জেলা সিলেক্ট করুন"}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[100] animate-fadeIn origin-top">
                <div className="p-2 border-b border-slate-700 bg-slate-800/95 backdrop-blur-sm">
                  <div className="flex items-center bg-slate-900 rounded-lg px-3 py-2 border border-slate-700 focus-within:border-emerald-500/50 transition-colors">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input 
                      type="text" 
                      placeholder="জেলা খুঁজুন..." 
                      className="bg-transparent text-sm w-full focus:outline-none text-white placeholder-slate-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {searchQuery && (
                      <X 
                        className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white"
                        onClick={() => setSearchQuery("")}
                      />
                    )}
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar bg-slate-800/95 backdrop-blur-sm">
                  {filteredDistricts?.map((dist) => (
                    <button
                      key={dist.id}
                      onClick={() => {
                        setSelectedDistrict(dist.id);
                        setIsDropdownOpen(false);
                        setSearchQuery("");
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-700 transition-colors border-l-2 ${selectedDistrict === dist.id ? "bg-emerald-500/10 text-emerald-400 border-emerald-500 font-medium" : "text-slate-300 border-transparent"}`}
                    >
                      {dist.bnName}
                    </button>
                  ))}
                  {filteredDistricts?.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-500">কোনো জেলা পাওয়া যায়নি</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* --- Dashboard Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          
          {/* Main Timer Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-950/80 border border-slate-700/50 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl backdrop-blur-md">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 ${nextEvent?.type === 'sehri' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
            
            <div className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
               {nextEvent?.type === 'sehri' ? <Moon className="w-5 h-5 md:w-6 md:h-6 text-blue-300" /> : <Sun className="w-5 h-5 md:w-6 md:h-6 text-orange-300" />}
            </div>
            
            {nextEvent ? (
              <>
                <h2 className={`text-sm md:text-lg font-medium tracking-wide mb-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 ${nextEvent?.type === 'sehri' ? 'text-blue-300' : 'text-orange-300'}`}>
                  <Clock className="w-3 h-3 md:w-4 md:h-4" /> {nextEvent.label}
                </h2>
                
                {/* FIXED: Font size reduced for mobile and whitespace-nowrap added */}
                <div className="relative z-10 text-[2.5rem] sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-mono tracking-tighter my-4 md:my-6 drop-shadow-sm whitespace-nowrap">
                  {timeLeft || "00 : 00 : 00"}
                </div>
                
                <div className="flex items-center gap-2 text-slate-400 text-xs md:text-sm bg-slate-900/60 px-4 py-2 rounded-full border border-slate-700/60 shadow-inner">
                  <span>সময়:</span>
                  <span className="text-white font-semibold font-mono tracking-wide">{format(nextEvent.time, "hh:mm a")}</span>
                </div>
              </>
            ) : (
               <div className="text-center py-10">
                 <h2 className="text-2xl font-bold text-slate-500">রমজান শেষ!</h2>
                 <p className="text-slate-600">ঈদ মোবারক</p>
               </div>
            )}
          </div>

          {/* Today's Stats Card */}
          <div className="flex flex-col gap-4">
            
             {/* Date Info */}
             <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-3xl p-5 text-center shadow-lg backdrop-blur-sm order-last lg:order-first">
               <p className="text-emerald-400 font-bold text-lg md:text-xl mb-1">
  {todayData?.ramadan ? `${todayData.ramadan} রমজান` : "রমজান"}
</p>
               <p className="text-emerald-200/60 text-xs font-medium uppercase tracking-wide">
                 {todayData ? format(new Date(todayData.date), "dd MMM yyyy") : format(new Date(), "dd MMM yyyy")}
               </p>
            </div>

            {/* Sehri Card */}
            <div className="flex-1 bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-3xl p-5 md:p-6 flex items-center justify-between hover:border-blue-500/30 transition-all shadow-lg hover:shadow-blue-900/10 group backdrop-blur-sm">
              <div>
                <p className="text-blue-400/80 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-blue-400 transition-colors">সেহরি শেষ</p>
                <p className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tight">{todayData?.sehri || "--:--"}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                <Moon className="w-5 h-5 md:w-6 md:h-6 text-blue-400 fill-current" />
              </div>
            </div>

            {/* Iftar Card */}
            <div className="flex-1 bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-3xl p-5 md:p-6 flex items-center justify-between hover:border-orange-500/30 transition-all shadow-lg hover:shadow-orange-900/10 group backdrop-blur-sm">
              <div>
                <p className="text-orange-400/80 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-orange-400 transition-colors">ইফতার শুরু</p>
                <p className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tight">{todayData?.iftar || "--:--"}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500/20 transition-all">
                <Sun className="w-5 h-5 md:w-6 md:h-6 text-orange-400 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* --- Monthly Schedule Table --- */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl relative z-10 mb-8">
          <div className="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/30">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span>পুরো মাসের সময়সূচি</span>
            </h3>
            <span className="text-xs font-medium text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              {currentDistrictName}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950/80 text-slate-300 sticky top-0 z-10 backdrop-blur-md shadow-sm">
                  <tr>
                    <th className="p-5 font-medium tracking-wide">রোজা</th>
                    <th className="p-5 font-medium tracking-wide">তারিখ</th>
                    <th className="p-5 font-medium text-blue-300 tracking-wide">সেহরি শেষ</th>
                    <th className="p-5 font-medium text-orange-300 tracking-wide">ইফতার শুরু</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 bg-slate-900/20">
                  {data?.schedule[selectedDistrict]?.map((day) => (
                    <tr 
                      key={day.ramadan} 
                      className={`hover:bg-slate-800/40 transition-colors group ${day.ramadan === todayData?.ramadan ? "bg-emerald-500/10 hover:bg-emerald-500/15 border-l-4 border-l-emerald-500" : "border-l-4 border-l-transparent"}`}
                    >
                      <td className="p-5">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${day.ramadan === todayData?.ramadan ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200"}`}>
                          {day.ramadan}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          {/* DATE FORMAT UPDATE: dd MMM yyyy (e.g. 19 Feb 2026) */}
                          <span className={`font-medium ${day.ramadan === todayData?.ramadan ? "text-white" : "text-slate-300"}`}>
                             {format(new Date(day.date), "dd MMM yyyy")}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5">{day.day}</span>
                        </div>
                      </td>
                      <td className="p-5 font-medium text-slate-200 font-mono tracking-tight">{day.sehri}</td>
                      <td className="p-5 font-medium text-slate-200 font-mono tracking-tight">{day.iftar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- Footer --- */}
        <footer className="relative z-10 border-t border-slate-800/60 pt-6 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            
            {/* Developer Credit */}
            <div className="flex items-center gap-2 text-sm font-medium bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 hover:border-emerald-500/30 transition-colors group">
              <Code className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform" />
              <span className="text-slate-300">Developed by <span className="text-emerald-400">Rafy Hossain</span></span>
            </div>

             {/* Source Link */}
            <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
             
              <p
                
                className=" decoration-emerald-500/50 hover:decoration-emerald-500"
              >
                Source: Islamic Foundation Bangladesh
              </p>
            </div>
            
          </div>
          
          <div className="text-center mt-4 text-sm text-slate-400">
            © 2026 Ramadan. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Ramadan;