import { useState } from 'react'
import { FaPlus, FaTrashAlt, FaListAlt, FaCopy, FaRegCircle, FaRegCheckSquare, FaRegStar, FaSave } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import CustomDropdown from '../../../../components/ui/CustomDropdown'
import RoleSelectionModal from '../../../../components/modals/RoleSelectionModal'

interface Question {
  id: number
  title: string
  description?: string
  type: string
  options?: string[]
  required: boolean
  scaleStart?: number
  scaleEnd?: number
  ratingCount?: number
  ratingIcon?: string
  gridRows?: string[]
  gridColumns?: string[]
  allowSpecificFileTypes?: boolean
}

interface FormData {
  title: string
  description: string
  startTime: string
  endTime: string
  allowedRoles: string[]
  questions: Question[]
}

function CreateForm() {
  const [formData, setFormData] = useState<FormData>({
    title: 'Untitled Form',
    description: '',
    startTime: '',
    endTime: '',
    allowedRoles: [],
    questions: []
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [showRoleModal, setShowRoleModal] = useState(false)
  const navigate = useNavigate()

  const roleNames: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    employee: 'Employee',
    visitor: 'Visitor',
    security: 'Security',
    receptionist: 'Receptionist',
    hr: 'HR Staff',
    it: 'IT Support'
  }

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      allowedRoles: prev.allowedRoles.includes(roleId)
        ? prev.allowedRoles.filter(id => id !== roleId)
        : [...prev.allowedRoles, roleId]
    }))
  }

  const saveForm = async () => {
    if (!formData.title.trim()) {
      setSaveMessage('Please enter a form title')
      return
    }

    if (questions.length === 0) {
      setSaveMessage('Please add at least one question')
      return
    }

    setSaving(true)
    setSaveMessage('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveMessage('Form saved successfully!')
      
      setTimeout(() => {
        navigate('/dashboard/forms')
      }, 1500)
    } catch (error) {
      setSaveMessage('Error saving form. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addQuestion = (type = 'multiple choice') => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: Date.now(),
        title: type === 'section' ? 'Untitled Section' : '',
        description: type === 'section' ? '' : undefined,
        type: type,
        options: type === 'section' ? undefined : ['Option 1'],
        required: false,
        scaleStart: 1,
        scaleEnd: 10,
        ratingCount: 10,
        ratingIcon: 'star',
        gridRows: ['Row 1'],
        gridColumns: ['Column 1'],
      },
    ])
  }

  const updateQuestionTitle = (id: number, newTitle: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, title: newTitle } : q))
    )
  }

  const updateOption = (questionId: number, optionIndex: number, newOption: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, idx) => (idx === optionIndex ? newOption : opt)),
            }
          : q
      )
    )
  }

  const addOption = (questionId: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`] }
          : q
      )
    )
  }

  const addGridRow = (questionId: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, gridRows: [...(q.gridRows || []), `Row ${(q.gridRows?.length || 0) + 1}`] }
          : q
      )
    )
  }

  const addGridColumn = (questionId: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, gridColumns: [...(q.gridColumns || []), `Column ${(q.gridColumns?.length || 0) + 1}`] }
          : q
      )
    )
  }

  const updateGridRow = (questionId: number, rowIndex: number, newValue: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              gridRows: q.gridRows?.map((row, idx) => (idx === rowIndex ? newValue : row)),
            }
          : q
      )
    )
  }

  const updateGridColumn = (questionId: number, colIndex: number, newValue: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              gridColumns: q.gridColumns?.map((col, idx) => (idx === colIndex ? newValue : col)),
            }
          : q
      )
    )
  }

  const deleteGridRow = (questionId: number, rowIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, gridRows: q.gridRows?.filter((_, i) => i !== rowIndex) }
          : q
      )
    )
  }

  const deleteGridColumn = (questionId: number, colIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, gridColumns: q.gridColumns?.filter((_, i) => i !== colIndex) }
          : q
      )
    )
  }

  const deleteOption = (questionId: number, optionIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options?.filter((_, i) => i !== optionIndex) }
          : q
      )
    )
  }

  const toggleRequired = (id: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, required: !q.required } : q))
    )
  }

  const deleteQuestion = (id: number) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id))
  }

  const updateScaleStart = (id: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, scaleStart: parseInt(value) } : q
      )
    )
  }

  const updateScaleEnd = (id: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, scaleEnd: parseInt(value) } : q
      )
    )
  }

  const updateRatingCount = (id: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, ratingCount: parseInt(value) } : q
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white py-4 rounded shadow flex items-center justify-between">
        <label htmlFor="form-title" className='text-black ml-4'>Form Title</label>
        <input
          id="form-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="text-xl text-black  font-bold bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          placeholder="Form Title"
        />
        <div className="flex mr-4 items-center gap-4">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={saveForm}
            disabled={saving}
            className="bg-[#1A3263] hover:opacity-90 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaSave size={18} />
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </div>

    

      {/* Questions */}
      {questions.map((question) => (
        <div key={question.id} className="bg-white p-4 rounded shadow mt-4">
          {question.type === 'section' ? (
            <div className="relative">
              <button
                onClick={() => deleteQuestion(question.id)}
                className="absolute top-0 right-0 text-gray-400 hover:text-red-500 focus:outline-none text-2xl"
              >
                ×
              </button>
              <input
                type="text"
                value={question.title}
                onChange={(e) => updateQuestionTitle(question.id, e.target.value)}
                className="text-xl text-black font-medium w-full focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-purple-600 pr-8"
                placeholder="Section title"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ width: '60%' }}>
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) => updateQuestionTitle(question.id, e.target.value)}
                    className="text-lg text-black font-medium w-full focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-purple-600"
                    placeholder="Question"
                  />
                </div>
                <div className="flex items-center text-black">
                  <CustomDropdown
                    value={question.type}
                    onChange={(newType) =>
                      setQuestions((prevQuestions) =>
                        prevQuestions.map((q) =>
                          q.id === question.id ? { ...q, type: newType } : q
                        )
                      )
                    }
                  />
                </div>
              </div>

              {/* Question Type Renderings */}
              {question.type?.toLowerCase() === 'short answer' && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Short answer text"
                    className="w-full text-black border-b border-gray-300 px-2 py-1 bg-transparent focus:outline-none"
                  />
                </div>
              )}

              {question.type?.toLowerCase() === 'paragraph' && (
                <div className="mt-4">
                  <textarea
                    placeholder="Long answer text"
                    rows={3}
                    className="w-full text-black border border-gray-300 rounded px-2 py-1 bg-transparent focus:outline-none resize-none"
                  />
                </div>
              )}

              {(question.type?.toLowerCase() === 'multiple choice' || 
                question.type?.toLowerCase() === 'checkboxes') && (
                <div className="mt-4 space-y-2">
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center" style={{ width: '60%' }}>
                      <span className="mr-2 text-gray-400">
                        {question.type?.toLowerCase() === 'multiple choice' && <FaRegCircle />}
                        {question.type?.toLowerCase() === 'checkboxes' && <FaRegCheckSquare />}
                      </span>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateOption(question.id, index, e.currentTarget.textContent || '')}
                        className="flex-1 text-black text-gray-700 focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-purple-600"
                      >
                        {option}
                      </div>
                      <button
                        onClick={() => deleteOption(question.id, index)}
                        className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none text-2xl"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(question.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Add option
                  </button>
                </div>
              )}

              {question.type?.toLowerCase() === 'linear scale' && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <select 
                      value={question.scaleStart || 1}
                      onChange={(e) => updateScaleStart(question.id, e.target.value)}
                      className="border text-black border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </select>
                    <span className="text-gray-600 text-sm">to</span>
                    <select 
                      value={question.scaleEnd || 10}
                      onChange={(e) => updateScaleEnd(question.id, e.target.value)}
                      className="border text-black border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {question.type?.toLowerCase() === 'rating' && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <select 
                      value={question.ratingCount || 5}
                      onChange={(e) => updateRatingCount(question.id, e.target.value)}
                      className="border text-black border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="7">7</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-4">
                    {Array.from({ length: question.ratingCount || 5 }, (_, index) => (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-600">{index + 1}</span>
                        <FaRegStar className="text-gray-400 text-xl" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {question.type?.toLowerCase() === 'dropdown' && (
                <div className="mt-4 space-y-2">
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center" style={{ width: '60%' }}>
                      <span className="mr-2 text-gray-400">{index + 1}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(question.id, index, e.target.value)}
                        className="flex-1 text-black text-gray-700 focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-purple-600 bg-transparent"
                      />
                      <button
                        onClick={() => deleteOption(question.id, index)}
                        className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none text-2xl"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(question.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Add option
                  </button>
                </div>
              )}

              {question.type?.toLowerCase() === 'file upload' && (
                <div className="mt-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">Users will be able to upload files</p>
                  </div>
                </div>
              )}

              {question.type?.toLowerCase() === 'date' && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Day, Month, Year"
                    className="border text-gray-500 border-gray-300 rounded px-3 py-2 focus:outline-none bg-gray-50"
                    readOnly
                  />
                </div>
              )}

              {question.type?.toLowerCase() === 'time' && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Hours : Minutes"
                    className="border text-gray-500 border-gray-300 rounded px-3 py-2 focus:outline-none bg-gray-50"
                    readOnly
                  />
                </div>
              )}

              {question.type?.toLowerCase() === 'multiple choice grid' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Rows</p>
                    {question.gridRows?.map((row, index) => (
                      <div key={index} className="flex items-center mb-2" style={{ width: '60%' }}>
                        <span className="mr-2 text-gray-400">{index + 1}.</span>
                        <input
                          type="text"
                          value={row}
                          onChange={(e) => updateGridRow(question.id, index, e.target.value)}
                          className="flex-1 text-black text-gray-700 focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-purple-600 bg-transparent"
                        />
                        <button
                          onClick={() => deleteGridRow(question.id, index)}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none text-2xl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addGridRow(question.id)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Add row
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Columns</p>
                    {question.gridColumns?.map((col, index) => (
                      <div key={index} className="flex items-center mb-2" style={{ width: '60%' }}>
                        <span className="mr-2 text-gray-400">{index + 1}.</span>
                        <input
                          type="text"
                          value={col}
                          onChange={(e) => updateGridColumn(question.id, index, e.target.value)}
                          className="flex-1 text-black text-gray-700 focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-purple-600 bg-transparent"
                        />
                        <button
                          onClick={() => deleteGridColumn(question.id, index)}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none text-2xl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addGridColumn(question.id)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Add column
                    </button>
                  </div>
                </div>
              )}

              {question.type?.toLowerCase() === 'checkbox grid' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Rows</p>
                    {question.gridRows?.map((row, index) => (
                      <div key={index} className="flex items-center mb-2" style={{ width: '60%' }}>
                        <span className="mr-2 text-gray-400">{index + 1}.</span>
                        <input
                          type="text"
                          value={row}
                          onChange={(e) => updateGridRow(question.id, index, e.target.value)}
                          className="flex-1 text-black text-gray-700 focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-purple-600 bg-transparent"
                        />
                        <button
                          onClick={() => deleteGridRow(question.id, index)}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none text-2xl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addGridRow(question.id)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Add row
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Columns</p>
                    {question.gridColumns?.map((col, index) => (
                      <div key={index} className="flex items-center mb-2" style={{ width: '60%' }}>
                        <span className="mr-2 text-gray-400">{index + 1}.</span>
                        <input
                          type="text"
                          value={col}
                          onChange={(e) => updateGridColumn(question.id, index, e.target.value)}
                          className="flex-1 text-black text-gray-700 focus:outline-none border-b border-transparent hover:border-gray-300 focus:border-purple-600 bg-transparent"
                        />
                        <button
                          onClick={() => deleteGridColumn(question.id, index)}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none text-2xl"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addGridColumn(question.id)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Add column
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 border-t border-gray-200 pt-4 flex items-center justify-end gap-4">
                <button
                  onClick={() => addQuestion()}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  title="Duplicate Question"
                >
                  <FaCopy size={16} />
                </button>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="text-gray-600 hover:text-red-700 focus:outline-none"
                  title="Delete Question"
                >
                  <FaTrashAlt size={16} />
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Required</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={() => toggleRequired(question.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 text-black h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

        {/* Form Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Form description"
              rows={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Roles
            </label>
            <div
              onClick={() => setShowRoleModal(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 min-h-[40px] flex items-center"
            >
              {formData.allowedRoles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.allowedRoles.map(roleId => (
                    <span key={roleId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {roleNames[roleId]}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Click to select allowed roles</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-[#1A3263] rounded-lg shadow-lg p-4 flex flex-col items-center space-y-6">
        <button
          onClick={() => addQuestion()}
          className="text-white hover:text-gray-200 focus:outline-none"
          title="Add Question"
        >
          <FaPlus size={20} />
        </button>
        <button 
          onClick={() => addQuestion('section')}
          className="text-white hover:text-gray-200 focus:outline-none" 
          title="Add Section"
        >
          <FaListAlt size={20} />
        </button>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        selectedRoles={formData.allowedRoles}
        onRoleToggle={handleRoleToggle}
      />
    </div>
  )
}

export default CreateForm