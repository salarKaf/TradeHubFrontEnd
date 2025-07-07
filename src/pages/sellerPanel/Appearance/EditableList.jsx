import {
  Pencil,
  Trash2,
  Plus,
  HelpCircle,
  Info,
  Save,
  X,
  Eye,
  ChevronDown,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";

const EditableList = ({ title, icon, items = [], viewText, onSave, editIcon, deleteIcon }) => {
  const [data, setData] = useState(items);
  const [editIndex, setEditIndex] = useState(null);
  const [tempItem, setTempItem] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", question: "", answer: "", description: "" });
  const [modal, setModal] = useState(null);
  const [viewModal, setViewModal] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleEdit = (index) => {
    setEditIndex(index);
    setTempItem(data[index]);
  };

  const handleSave = (index) => {
    if (!tempItem.title.trim() ||
        (viewText.includes("پرسش") && (!tempItem.question?.trim() || !tempItem.answer?.trim())) ||
        (viewText.includes("توضیحات") && !tempItem.description?.trim())
    ) {
      setModal({ type: "error", text: "همه فیلدها باید پر شوند." });
      return;
    }
    const updated = [...data];
    updated[index] = tempItem;
    setData(updated);
    setEditIndex(null);
    setTempItem({});
    onSave && onSave(updated);
  };

  const handleDelete = (index) => {
    setModal({
      type: "confirm",
      text: "آیا مطمئن هستید که می‌خواهید این مورد را حذف کنید؟",
      onConfirm: () => {
        const updated = data.filter((_, i) => i !== index);
        setData(updated);
        onSave && onSave(updated);
        setModal(null);
      },
    });
  };

  const handleAdd = () => {
    if (!newItem.title.trim() ||
        (viewText.includes("پرسش") && (!newItem.question?.trim() || !newItem.answer?.trim())) ||
        (viewText.includes("توضیحات") && !newItem.description?.trim())
    ) {
      setModal({ type: "error", text: "همه فیلدها باید پر شوند." });
      return;
    }
    const newData = [...data, { ...newItem, id: Date.now() }];
    setData(newData);
    setNewItem({ title: "", question: "", answer: "", description: "" });
    setShowAddForm(false);
    onSave && onSave(newData);
  };

  const addNewRow = () => {
    const newData = [...data, { 
      id: Date.now(), 
      title: "", 
      question: "", 
      answer: "", 
      description: "" 
    }];
    setData(newData);
    setEditIndex(newData.length - 1);
    setTempItem({ title: "", question: "", answer: "", description: "" });
    onSave && onSave(newData);
  };

  return (
    <div className="space-y-6 relative p-4">
      {/* Header with title and toggle button */}
      <div className="flex items-center gap-3 font-modam font-bold text-[#1E212D] opacity-90 text-2xl">
        
        <div className="flex items-center justify-center w-8 h-8">
          {icon}
        </div>
        <span>{title}</span>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className=" p-2 "
        >
          {isExpanded ? 
            <FaChevronDown className="w-5 h-5 text-[#1E212D]" />: 
            <FaChevronLeft className="w-5 h-5 text-[#1E212D]" />
          }
        </button>
      </div>

      {/* Line under title */}
      <div className="w-full h-[0.8px] bg-black bg-opacity-20 shadow-[0_2px_6px_rgba(0,0,0,0.3)]" />

      {/* Table content */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Table */}
          <div className="border border-[#d6c2aa] rounded-lg overflow-hidden bg-white font-modam">
            <table className="w-full">
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id} className="border-b border-[#d6c2aa] last:border-b-0">
                    <td className="px-4 py-3 text-right">
                      {editIndex === index ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={tempItem.title}
                            onChange={(e) =>
                              setTempItem({ ...tempItem, title: e.target.value })
                            }
                            placeholder="عنوان"
                            className="w-full border border-gray-300 p-2 rounded text-sm"
                          />
                          {viewText.includes("پرسش") ? (
                            <>
                              <input
                                type="text"
                                value={tempItem.question || ""}
                                onChange={(e) =>
                                  setTempItem({ ...tempItem, question: e.target.value })
                                }
                                placeholder="پرسش را وارد کنید"
                                className="w-full border border-gray-300 p-2 rounded text-sm"
                              />
                              <textarea
                                value={tempItem.answer || ""}
                                onChange={(e) =>
                                  setTempItem({ ...tempItem, answer: e.target.value })
                                }
                                placeholder="پاسخ را وارد کنید"
                                className="w-full border border-gray-300 p-2 rounded text-sm"
                                rows={3}
                              />
                            </>
                          ) : (
                            <textarea
                              value={tempItem.description || ""}
                              onChange={(e) =>
                                setTempItem({ ...tempItem, description: e.target.value })
                              }
                              placeholder="توضیحات"
                              className="w-full border border-gray-300 p-2 rounded text-sm"
                              rows={3}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="font-medium text-sm">{item.title}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 w-64 font-modam">
                      <div className="flex gap-2 justify-end items-center">
                        <button 
                          onClick={() => setViewModal(item)} 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                        >
                          {viewText.includes("پرسش") ? "مشاهده پرسش و پاسخ" : "مشاهده توضیحات"}
                        </button>
                        {editIndex === index ? (
                          <>
                            <button 
                              onClick={() => handleSave(index)} 
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                            >
                              <Save className="w-6 h-6 text-green-600" />
                            </button>
                            <button 
                              onClick={() => setEditIndex(null)} 
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                            >
                              <X className="w-6 h-6 text-gray-500" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEdit(index)} 
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                            >
                              <Pencil className="w-5 h-5 text-[#1E212D]" />
                            </button>
                            <button 
                              onClick={() => handleDelete(index)} 
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                            >
                              <Trash2 className="w-6 h-8 text-[#1E212D]" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add button positioned to the left and attached to table */}
          <div className="flex justify-start font-modam">
            <button
              onClick={addNewRow}
              className="bg-[#fff0d9] hover:bg-[#f7e5cc] px-4 py-2 rounded-md text-sm border border-[#d6c2aa] flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              افزودن ردیف جدید
            </button>
          </div>
        </div>
      )}

      {/* Modal for confirmations and errors */}
      {modal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 max-w-sm w-full mx-4">
            <div className="text-center text-sm font-medium text-gray-700">{modal.text}</div>
            <div className="flex justify-center gap-4">
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={modal.onConfirm}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    بله
                  </button>
                  <button
                    onClick={() => setModal(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
                  >
                    لغو
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal(null)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                  بستن
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50 font-modam">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-800">{viewModal.title}</h3>
              <button
                onClick={() => setViewModal(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              {viewText.includes("پرسش") ? (
                <>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">پرسش:</p>
                    <p className="text-gray-600">{viewModal.question}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-700 mb-1">پاسخ:</p>
                    <p className="text-blue-600">{viewModal.answer}</p>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-700 mb-1">توضیحات:</p>
                  <p className="text-gray-600">{viewModal.description}</p>
                </div>
              )}
            </div>
            <div className="text-center pt-3">
              <button
                onClick={() => setViewModal(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableList;