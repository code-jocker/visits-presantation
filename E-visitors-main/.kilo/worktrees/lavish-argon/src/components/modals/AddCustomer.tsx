import { useState, useEffect } from "react";
import { FaBuilding, FaUser, FaArrowRight, FaArrowLeft, FaMapMarkerAlt, FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";

interface AddCustomerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: any) => void;
}

function AddCustomer({ isOpen, onClose, onSubmit }: AddCustomerProps) {
  const [step, setStep] = useState(1);
  const [companyCountryCode, setCompanyCountryCode] = useState('+250');
  const [isCompanyCountryOpen, setIsCompanyCountryOpen] = useState(false);
  const [contactCountryCode, setContactCountryCode] = useState('+250');
  const [isContactCountryOpen, setIsContactCountryOpen] = useState(false);
  
  // Location data from API
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [cells, setCells] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    industry: "",
    companySize: "",
    website: "",
    subscriptionPlan: "",
    startDate: "",
    endDate: "",
    // Address Information
    country: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    // Contact Person Information
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    position: "",
    department: ""
  });

  const countries = [
    { code: '+250', name: 'Rwanda', flag: 'RW' },
    { code: '+254', name: 'Kenya', flag: 'KE' },
    { code: '+256', name: 'Uganda', flag: 'UG' },
    { code: '+255', name: 'Tanzania', flag: 'TZ' },
    { code: '+257', name: 'Burundi', flag: 'BI' }
  ];

  // Fetch provinces on mount
  useEffect(() => {
    if (isOpen) {
      fetch('https://rda-ad-divisions.onrender.com/provinces')
        .then(res => res.json())
        .then(data => setProvinces(data.data || []))
        .catch(err => console.error('Error fetching provinces:', err));
    }
  }, [isOpen]);

  // Fetch districts when province changes
  useEffect(() => {
    if (formData.province) {
      fetch(`https://rda-ad-divisions.onrender.com/districts?province=${formData.province}`)
        .then(res => res.json())
        .then(data => setDistricts(data.data || []))
        .catch(err => console.error('Error fetching districts:', err));
    } else {
      setDistricts([]);
      setSectors([]);
      setCells([]);
      setVillages([]);
    }
  }, [formData.province]);

  // Fetch sectors when district changes
  useEffect(() => {
    if (formData.province && formData.district) {
      fetch(`https://rda-ad-divisions.onrender.com/sectors?province=${formData.province}&district=${formData.district}`)
        .then(res => res.json())
        .then(data => setSectors(data.data || []))
        .catch(err => console.error('Error fetching sectors:', err));
    } else {
      setSectors([]);
      setCells([]);
      setVillages([]);
    }
  }, [formData.province, formData.district]);

  // Fetch cells when sector changes
  useEffect(() => {
    if (formData.province && formData.district && formData.sector) {
      fetch(`https://rda-ad-divisions.onrender.com/cells?province=${formData.province}&district=${formData.district}&sector=${formData.sector}`)
        .then(res => res.json())
        .then(data => setCells(data.data || []))
        .catch(err => console.error('Error fetching cells:', err));
    } else {
      setCells([]);
      setVillages([]);
    }
  }, [formData.province, formData.district, formData.sector]);

  // Fetch villages when cell changes
  useEffect(() => {
    if (formData.province && formData.district && formData.sector && formData.cell) {
      fetch(`https://rda-ad-divisions.onrender.com/villages?province=${formData.province}&district=${formData.district}&sector=${formData.sector}&cell=${formData.cell}`)
        .then(res => res.json())
        .then(data => setVillages(data.data || []))
        .catch(err => console.error('Error fetching villages:', err));
    } else {
      setVillages([]);
    }
  }, [formData.province, formData.district, formData.sector, formData.cell]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      industry: "",
      companySize: "",
      website: "",
      subscriptionPlan: "",
      startDate: "",
      endDate: "",
      country: "",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      position: "",
      department: ""
    });
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
        >
          <FaTimes size={20} />
        </button>
        
        {/* Header */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Add New Customer</h3>
          <div className="flex items-center mt-4 gap-2">
            <div className={`flex items-center gap-2 ${
              step === 1 ? 'text-blue-600' : 'text-green-600'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {step === 1 ? '1' : '✓'}
              </div>
              <span className="text-sm font-medium">Company</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
            <div className={`flex items-center gap-2 ${
              step === 2 ? 'text-blue-600' : step > 2 ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 2 ? 'bg-blue-600 text-white' : step > 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Address</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
            <div className={`flex items-center gap-2 ${
              step === 3 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Contact</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaBuilding className="text-blue-600" size={20} />
                  <h4 className="text-lg font-semibold text-gray-900">Company Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.companyEmail}
                      onChange={(e) => setFormData({...formData, companyEmail: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="company@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Phone *</label>
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCompanyCountryOpen(!isCompanyCountryOpen)}
                          className="flex items-center gap-2 px-3 py-3 bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg hover:bg-gray-100 transition-colors min-w-[120px]"
                        >
                          <img 
                            src={`https://flagcdn.com/16x12/${countries.find(c => c.code === companyCountryCode)?.flag.toLowerCase()}.png`}
                            alt="flag"
                            className="w-4 h-3"
                          />
                          <span className="text-xs text-black">{countries.find(c => c.code === companyCountryCode)?.name}</span>
                          <FaChevronDown className={`text-xs transition-transform ${isCompanyCountryOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isCompanyCountryOpen && (
                          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-300 py-1 min-w-[200px] z-50">
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setCompanyCountryCode(country.code)
                                  setIsCompanyCountryOpen(false)
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <img 
                                  src={`https://flagcdn.com/16x12/${country.flag.toLowerCase()}.png`}
                                  alt={country.name}
                                  className="w-4 h-3"
                                />
                                <span>{country.code}</span>
                                <span>{country.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-4 py-4 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
                          {companyCountryCode}
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.companyPhone}
                          onChange={(e) => setFormData({...formData, companyPhone: e.target.value})}
                          className="w-full pl-16 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                          placeholder="xxx xxx xxx"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan *</label>
                  <select
                    required
                    value={formData.subscriptionPlan}
                    onChange={(e) => setFormData({...formData, subscriptionPlan: e.target.value})}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a plan</option>
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="text-blue-600" size={20} />
                  <h4 className="text-lg font-semibold text-gray-900">Company Address</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select country</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Burundi">Burundi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                    <select
                      required
                      value={formData.province}
                      onChange={(e) => {
                        setFormData({...formData, province: e.target.value, district: '', sector: '', cell: '', village: ''})
                      }}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select province</option>
                      {provinces.map((province, index) => (
                        <option key={index} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                    <select
                      required
                      value={formData.district}
                      onChange={(e) => {
                        setFormData({...formData, district: e.target.value, sector: '', cell: '', village: ''})
                      }}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={!formData.province}
                    >
                      <option value="">Select district</option>
                      {districts.map((district, index) => (
                        <option key={index} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sector *</label>
                    <select
                      required
                      value={formData.sector}
                      onChange={(e) => {
                        setFormData({...formData, sector: e.target.value, cell: '', village: ''})
                      }}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={!formData.district}
                    >
                      <option value="">Select sector</option>
                      {sectors.map((sector, index) => (
                        <option key={index} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cell</label>
                    <select
                      value={formData.cell}
                      onChange={(e) => {
                        setFormData({...formData, cell: e.target.value, village: ''})
                      }}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={!formData.sector}
                    >
                      <option value="">Select cell</option>
                      {cells.map((cell, index) => (
                        <option key={index} value={cell}>{cell}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                    <select
                      value={formData.village}
                      onChange={(e) => setFormData({...formData, village: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={!formData.cell}
                    >
                      <option value="">Select village</option>
                      {villages.map((village, index) => (
                        <option key={index} value={village}>{village}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaUser className="text-blue-600" size={20} />
                  <h4 className="text-lg font-semibold text-gray-900">Contact Person Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsContactCountryOpen(!isContactCountryOpen)}
                          className="flex items-center gap-2 px-3 py-3 bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg hover:bg-gray-100 transition-colors min-w-[120px]"
                        >
                          <img 
                            src={`https://flagcdn.com/16x12/${countries.find(c => c.code === contactCountryCode)?.flag.toLowerCase()}.png`}
                            alt="flag"
                            className="w-4 h-3"
                          />
                          <span className="text-xs text-black">{countries.find(c => c.code === contactCountryCode)?.name}</span>
                          <FaChevronDown className={`text-xs transition-transform ${isContactCountryOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isContactCountryOpen && (
                          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-300 py-1 min-w-[200px] z-50">
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setContactCountryCode(country.code)
                                  setIsContactCountryOpen(false)
                                }}
                                className="w-full text-left px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <img 
                                  src={`https://flagcdn.com/16x12/${country.flag.toLowerCase()}.png`}
                                  alt={country.name}
                                  className="w-4 h-4"
                                />
                                <span>{country.code}</span>
                                <span>{country.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
                          {contactCountryCode}
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                          className="w-full pl-16 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                          placeholder="xxx xxx xx"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CEO, Manager"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select department</option>
                      <option value="Executive">Executive</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex gap-3">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-[#1A3263] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <FaArrowRight size={14} />
                </button>
              </>
            ) : step === 2 ? (
              <>
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <FaArrowLeft size={14} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-[#1A3263] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <FaArrowRight size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <FaArrowLeft size={14} />
                  Back
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 bg-[#1A3263] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus size={14} />
                  Add Customer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCustomer;