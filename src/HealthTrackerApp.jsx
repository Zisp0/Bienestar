import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Plus, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Edit2, Trash2, ArrowUp, ArrowDown, Settings, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const styles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;

const HealthTrackerApp = () => {
  const [activeView, setActiveView] = useState('registro');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [openAccordion, setOpenAccordion] = useState('resumen');
  const [customCategories, setCustomCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showArchivedEmotions, setShowArchivedEmotions] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('healthEntries');
    const storedCategories = localStorage.getItem('customCategories');
    if (stored) {
      setEntries(JSON.parse(stored));
    }
    if (storedCategories) {
      setCustomCategories(JSON.parse(storedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);

  const [formData, setFormData] = useState({
    dolor: '',
    libido: '',
    sueno: '',
    estadoAnimo: '',
    emocion: '',
    energiaFisica: '',
    claridadMental: '',
    motivacion: '',
    estres: '',
    sensacionCorporal: '',
    actividadFisica: '',
    despertaresNocturnos: false,
    suenosVividos: false,
    periodo: false,
    sintomasFisicos: [],
    comentarios: ''
  });

  const categories = {
    dolor: ['Sin dolor', 'Leve', 'Moderado', 'Fuerte', 'Muy fuerte'],
    libido: ['Muy baja', 'Baja', 'Normal', 'Alta', 'Muy alta'],
    sueno: ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'],
    estadoAnimo: ['Muy triste', 'Triste', 'Neutral', 'Feliz', 'Muy feliz'],
    emocion: customCategories.filter(c => !c.archived).length > 0 
      ? customCategories.filter(c => !c.archived).map(c => c.name) 
      : [],
    energiaFisica: ['Muy baja', 'Baja', 'Moderada', 'Alta', 'Muy alta'],
    claridadMental: ['Muy baja', 'Baja', 'Moderada', 'Alta', 'Muy alta'],
    motivacion: ['Muy baja', 'Baja', 'Moderada', 'Alta', 'Muy alta'],
    estres: ['Muy bajo', 'Bajo', 'Moderado', 'Alto', 'Muy alto'],
    sensacionCorporal: ['Desconectada', 'Presente'],
    actividadFisica: ['Nada', 'Suave', 'Intensa']
  };

  const sintomasFisicosOptions = [
    'Dolor en vientre',
    'Dolor lumbar',
    'Sensibilidad mamaria',
    'Acné',
    'Hinchazón',
    'Dolor de cabeza'
  ];

  const categoryColors = {
    dolor: ['bg-green-500', 'bg-yellow-400', 'bg-orange-400', 'bg-red-500', 'bg-red-700'],
    libido: ['bg-blue-300', 'bg-blue-400', 'bg-purple-400', 'bg-pink-500', 'bg-pink-600'],
    sueno: ['bg-gray-600', 'bg-gray-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'],
    estadoAnimo: ['bg-indigo-800', 'bg-indigo-500', 'bg-gray-400', 'bg-amber-400', 'bg-yellow-400'],
    emocion: customCategories.filter(c => !c.archived).length > 0 
      ? customCategories.filter(c => !c.archived).map(c => c.color) 
      : ['bg-purple-600', 'bg-teal-500', 'bg-orange-500', 'bg-yellow-500', 'bg-red-600'],
    energiaFisica: ['bg-red-500', 'bg-orange-400', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'],
    claridadMental: ['bg-slate-600', 'bg-slate-500', 'bg-blue-400', 'bg-cyan-400', 'bg-sky-500'],
    motivacion: ['bg-gray-500', 'bg-orange-400', 'bg-amber-500', 'bg-yellow-400', 'bg-lime-500'],
    estres: ['bg-green-500', 'bg-lime-400', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600'],
    sensacionCorporal: ['bg-gray-400', 'bg-green-500'],
    actividadFisica: ['bg-gray-400', 'bg-blue-400', 'bg-purple-600']
  };

  const categoryLabels = {
    dolor: 'Dolor',
    libido: 'Libido',
    sueno: 'Sueño',
    estadoAnimo: 'Estado de Ánimo',
    emocion: 'Emoción',
    energiaFisica: 'Energía Física',
    claridadMental: 'Claridad Mental',
    motivacion: 'Motivación',
    estres: 'Estrés del Día',
    sensacionCorporal: 'Sensación Corporal',
    actividadFisica: 'Actividad Física'
  };

  const addOrUpdateCustomCategory = (category) => {
    if (editingCategory !== null) {
      const updated = [...customCategories];
      updated[editingCategory] = { ...category, archived: updated[editingCategory].archived || false };
      setCustomCategories(updated);
    } else {
      setCustomCategories([...customCategories, { ...category, archived: false }]);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const archiveCustomCategory = (index) => {
    const updated = [...customCategories];
    updated[index] = { ...updated[index], archived: true };
    setCustomCategories(updated);
  };

  const unarchiveCustomCategory = (index) => {
    const updated = [...customCategories];
    updated[index] = { ...updated[index], archived: false };
    setCustomCategories(updated);
  };

  const deleteCustomCategory = (index) => {
    const updated = customCategories.filter((_, i) => i !== index);
    setCustomCategories(updated);
  };

  const moveCategory = (index, direction) => {
    const updated = [...customCategories];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < updated.length) {
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      setCustomCategories(updated);
    }
  };

  const handleSubmit = () => {
    const requiredFields = ['dolor', 'libido', 'sueno', 'estadoAnimo', 'emocion', 
      'energiaFisica', 'claridadMental', 'motivacion', 'estres', 'sensacionCorporal', 'actividadFisica'];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert('⚠️ Por favor completa todas las categorías obligatorias antes de guardar');
      return;
    }
    
    try {
      const newEntries = { ...entries };
      newEntries[selectedDate] = { 
        ...formData,
        timestamp: new Date().toISOString() 
      };
      
      setEntries(newEntries);
      localStorage.setItem('healthEntries', JSON.stringify(newEntries));
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      setFormData({
        dolor: '',
        libido: '',
        sueno: '',
        estadoAnimo: '',
        emocion: '',
        energiaFisica: '',
        claridadMental: '',
        motivacion: '',
        estres: '',
        sensacionCorporal: '',
        actividadFisica: '',
        despertaresNocturnos: false,
        suenosVividos: false,
        periodo: false,
        sintomasFisicos: [],
        comentarios: ''
      });
      
      setSelectedDate(new Date().toISOString().split('T')[0]);
      
    } catch (error) {
      alert('❌ Error al guardar el registro. Por favor intenta de nuevo.');
      console.error('Error guardando:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCheckbox = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleSintoma = (sintoma) => {
    setFormData(prev => {
      const current = prev.sintomasFisicos || [];
      const updated = current.includes(sintoma)
        ? current.filter(s => s !== sintoma)
        : [...current, sintoma];
      return { ...prev, sintomasFisicos: updated };
    });
  };

  useEffect(() => {
    const entry = entries[selectedDate];
    if (entry) {
      setFormData({
        ...entry,
        sintomasFisicos: entry.sintomasFisicos || []
      });
    } else {
      setFormData({
        dolor: '',
        libido: '',
        sueno: '',
        estadoAnimo: '',
        emocion: '',
        energiaFisica: '',
        claridadMental: '',
        motivacion: '',
        estres: '',
        sensacionCorporal: '',
        actividadFisica: '',
        despertaresNocturnos: false,
        suenosVividos: false,
        periodo: false,
        sintomasFisicos: [],
        comentarios: ''
      });
    }
  }, [selectedDate, entries]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getColorForCategory = (category, value) => {
    if (category === 'emocion') {
      const activeCategories = customCategories.filter(c => !c.archived);
      const index = activeCategories.map(c => c.name).indexOf(value);
      const customCat = activeCategories[index];
      return customCat ? '' : categoryColors[category][index] || 'bg-gray-300';
    }
    const index = categories[category]?.indexOf(value);
    return categoryColors[category]?.[index] || 'bg-gray-300';
  };

  const getColorStyle = (category, value) => {
    if (category === 'emocion') {
      const activeCategories = customCategories.filter(c => !c.archived);
      const index = activeCategories.map(c => c.name).indexOf(value);
      const customCat = activeCategories[index];
      return customCat ? { backgroundColor: customCat.color } : {};
    }
    return {};
  };

  const getStats = () => {
    const filteredEntries = Object.entries(entries).filter(([date]) => {
      return date >= dateRange.start && date <= dateRange.end;
    }).map(([, entry]) => entry);
    
    if (filteredEntries.length === 0) return null;

    const stats = {
      dolor: {},
      libido: {},
      sueno: {},
      estadoAnimo: {},
      emocion: {},
      energiaFisica: {},
      claridadMental: {},
      motivacion: {},
      estres: {},
      sensacionCorporal: {},
      actividadFisica: {},
      despertaresNocturnos: { true: 0, false: 0 },
      suenosVividos: { true: 0, false: 0 },
      periodo: { true: 0, false: 0 },
      sintomasFisicos: {}
    };

    filteredEntries.forEach(entry => {
      Object.keys(categories).forEach(key => {
        if (entry[key]) {
          stats[key][entry[key]] = (stats[key][entry[key]] || 0) + 1;
        }
      });

      // Checkboxes
      stats.despertaresNocturnos[entry.despertaresNocturnos ? 'true' : 'false']++;
      stats.suenosVividos[entry.suenosVividos ? 'true' : 'false']++;
      stats.periodo[entry.periodo ? 'true' : 'false']++;

      // Síntomas físicos
      if (entry.sintomasFisicos && Array.isArray(entry.sintomasFisicos)) {
        entry.sintomasFisicos.forEach(sintoma => {
          stats.sintomasFisicos[sintoma] = (stats.sintomasFisicos[sintoma] || 0) + 1;
        });
      }
    });

    return stats;
  };

  const getChartData = () => {
    const filteredEntries = Object.entries(entries)
      .filter(([date]) => date >= dateRange.start && date <= dateRange.end)
      .sort(([a], [b]) => a.localeCompare(b));
    
    if (filteredEntries.length === 0) return null;

    const categoryToValue = (category, value) => {
      const index = categories[category]?.indexOf(value);
      return index !== -1 ? index + 1 : null;
    };

    return filteredEntries.map(([date, entry]) => ({
      date: new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      dolor: entry.dolor ? categoryToValue('dolor', entry.dolor) : null,
      libido: entry.libido ? categoryToValue('libido', entry.libido) : null,
      sueño: entry.sueno ? categoryToValue('sueno', entry.sueno) : null,
      ánimo: entry.estadoAnimo ? categoryToValue('estadoAnimo', entry.estadoAnimo) : null,
      emoción: entry.emocion ? categoryToValue('emocion', entry.emocion) : null,
      energía: entry.energiaFisica ? categoryToValue('energiaFisica', entry.energiaFisica) : null,
      claridad: entry.claridadMental ? categoryToValue('claridadMental', entry.claridadMental) : null,
      motivación: entry.motivacion ? categoryToValue('motivacion', entry.motivacion) : null,
      estrés: entry.estres ? categoryToValue('estres', entry.estres) : null
    }));
  };

  const stats = getStats();
  const chartData = getChartData();

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const CategoryModal = () => {
    const [showForm, setShowForm] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryColor, setCategoryColor] = useState('#a855f7');

    useEffect(() => {
      if (editingCategory !== null && customCategories[editingCategory]) {
        setCategoryName(customCategories[editingCategory].name);
        setCategoryColor(customCategories[editingCategory].color);
        setShowForm(true);
      } else {
        setCategoryName('');
        setCategoryColor('#a855f7');
      }
    }, [editingCategory]);

    const handleSave = () => {
      if (!categoryName.trim()) {
        alert('Por favor ingresa un nombre para la emoción');
        return;
      }
      
      addOrUpdateCustomCategory({ name: categoryName, color: categoryColor });
      setCategoryName('');
      setCategoryColor('#a855f7');
      setShowForm(false);
      setEditingCategory(null);
    };

    const handleClose = () => {
      setShowCategoryModal(false);
      setShowForm(false);
      setEditingCategory(null);
      setCategoryName('');
      setCategoryColor('#a855f7');
      setShowArchivedEmotions(false);
    };

    const handleCancel = () => {
      setShowForm(false);
      setEditingCategory(null);
      setCategoryName('');
      setCategoryColor('#a855f7');
    };

    const activeEmotions = customCategories.filter(c => !c.archived);
    const archivedEmotions = customCategories.filter(c => c.archived);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">
              {showForm ? (editingCategory !== null ? 'Editar Emoción' : 'Nueva Emoción') : 'Gestionar Emociones'}
            </h3>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!showForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">
                    Mostrar archivadas ({archivedEmotions.length})
                  </span>
                  <button
                    onClick={() => setShowArchivedEmotions(!showArchivedEmotions)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showArchivedEmotions ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        showArchivedEmotions ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {activeEmotions.length === 0 && !showArchivedEmotions ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No has creado emociones personalizadas aún</p>
                    <p className="text-sm text-gray-400">Haz clic en "Nueva Emoción" para comenzar</p>
                  </div>
                ) : (
                  <>
                    {activeEmotions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Activas</h4>
                        {activeEmotions.map((cat) => {
                          const index = customCategories.indexOf(cat);
                          const activeIndex = activeEmotions.indexOf(cat);
                          return (
                            <div key={index} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                              <div 
                                className="w-10 h-10 rounded-lg shadow-md"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="flex-1 font-semibold text-gray-800 text-lg">{cat.name}</span>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => moveCategory(index, -1)}
                                  disabled={activeIndex === 0}
                                  className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="Mover arriba"
                                >
                                  <ArrowUp className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => moveCategory(index, 1)}
                                  disabled={activeIndex === activeEmotions.length - 1}
                                  className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="Mover abajo"
                                >
                                  <ArrowDown className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCategory(index);
                                    setShowForm(true);
                                  }}
                                  className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => archiveCustomCategory(index)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Archivar"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {showArchivedEmotions && archivedEmotions.length > 0 && (
                      <div className="space-y-2 mt-6 pt-6 border-t-2 border-gray-200">
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Archivadas</h4>
                        {archivedEmotions.map((cat) => {
                          const index = customCategories.indexOf(cat);
                          return (
                            <div key={index} className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl opacity-60">
                              <div 
                                className="w-10 h-10 rounded-lg shadow-md"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="flex-1 font-semibold text-gray-600 text-lg line-through">{cat.name}</span>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => unarchiveCustomCategory(index)}
                                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                  title="Restaurar"
                                >
                                  Restaurar
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`¿Eliminar permanentemente "${cat.name}"? Esta acción no se puede deshacer.`)) {
                                      deleteCustomCategory(index);
                                    }
                                  }}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar permanentemente"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {showArchivedEmotions && archivedEmotions.length === 0 && (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        No hay emociones archivadas
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-6 h-6" />
                  Nueva Emoción
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la emoción
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Ej: Ansiedad, Calma, Estrés..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={categoryColor}
                      onChange={(e) => setCategoryColor(e.target.value)}
                      className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-300"
                    />
                    <div className="flex-1">
                      <div 
                        className="w-full h-20 rounded-lg shadow-md"
                        style={{ backgroundColor: categoryColor }}
                      />
                      <p className="text-sm text-gray-600 mt-2 font-mono">{categoryColor}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    {editingCategory !== null ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
  <>
    <style>{styles}</style>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-500 text-xl font-bold">✓</span>
            </div>
            <div>
              <p className="font-bold">¡Registro guardado!</p>
              <p className="text-sm text-green-100">Los datos se guardaron exitosamente</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Registro de Salud
            </h1>
            <p className="text-purple-100">Monitorea tu bienestar diario</p>
          </div>

          <div className="flex border-b bg-gray-50 overflow-x-auto">
            <button
              onClick={() => setActiveView('registro')}
              className={`flex-1 py-4 px-6 font-semibold transition-all whitespace-nowrap ${
                activeView === 'registro'
                  ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus className="inline mr-2 w-5 h-5" />
              Registro
            </button>
            <button
              onClick={() => setActiveView('calendario')}
              className={`flex-1 py-4 px-6 font-semibold transition-all whitespace-nowrap ${
                activeView === 'calendario'
                  ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="inline mr-2 w-5 h-5" />
              Calendario
            </button>
            <button
              onClick={() => setActiveView('estadisticas')}
              className={`flex-1 py-4 px-6 font-semibold transition-all whitespace-nowrap ${
                activeView === 'estadisticas'
                  ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="inline mr-2 w-5 h-5" />
              Estadísticas
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeView === 'registro' && (
              <div>
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha del registro
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full md:w-auto px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="w-full md:w-auto px-4 py-3 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Gestionar Emociones
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Categorías de escala */}
                  {Object.keys(categories).map((category) => (
                    <div key={category} className="bg-gray-50 p-6 rounded-xl">
                      <label className="block text-lg font-semibold text-gray-800 mb-3">
                        {categoryLabels[category]}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {categories[category].map((option) => {
                          const isSelected = formData[category] === option;
                          const colorStyle = isSelected ? getColorStyle(category, option) : {};
                          
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleChange(category, option)}
                              style={colorStyle}
                              className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                                isSelected
                                  ? `${getColorForCategory(category, option) || ''} text-white shadow-lg`
                                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Checkboxes simples */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      Indicadores del día
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.despertaresNocturnos}
                          onChange={() => toggleCheckbox('despertaresNocturnos')}
                          className="w-6 h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 font-medium">Despertares nocturnos</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.suenosVividos}
                          onChange={() => toggleCheckbox('suenosVividos')}
                          className="w-6 h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 font-medium">Sueños vívidos</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.periodo}
                          onChange={() => toggleCheckbox('periodo')}
                          className="w-6 h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 font-medium">Periodo</span>
                      </label>
                    </div>
                  </div>

                  {/* Síntomas físicos */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      Síntomas físicos
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {sintomasFisicosOptions.map((sintoma) => (
                        <label
                          key={sintoma}
                          className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={(formData.sintomasFisicos || []).includes(sintoma)}
                            onChange={() => toggleSintoma(sintoma)}
                            className="w-6 h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 font-medium">{sintoma}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Comentarios */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Comentarios
                    </label>
                    <textarea
                      value={formData.comentarios}
                      onChange={(e) => handleChange('comentarios', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Escribe notas adicionales sobre tu día..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Guardar Registro
                  </button>
                </div>
              </div>
            )}

            {activeView === 'calendario' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hasEntry = entries[dateStr];
                    const isSelected = dateStr === selectedDate;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`aspect-square rounded-lg font-semibold transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-lg scale-110'
                            : hasEntry
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {entries[selectedDate] && (
                  <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Registro del {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {Object.keys(categories).map((category) => 
                        entries[selectedDate][category] && (
                          <div key={category} className="bg-white p-4 rounded-lg">
                            <span className="font-semibold text-gray-700">{categoryLabels[category]}:</span>
                            <span 
                              className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${getColorForCategory(category, entries[selectedDate][category])}`}
                              style={getColorStyle(category, entries[selectedDate][category])}
                            >
                              {entries[selectedDate][category]}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* Checkboxes */}
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <span className="font-semibold text-gray-700 block mb-2">Indicadores:</span>
                      <div className="flex flex-wrap gap-2">
                        {entries[selectedDate].despertaresNocturnos && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            Despertares nocturnos
                          </span>
                        )}
                        {entries[selectedDate].suenosVividos && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            Sueños vívidos
                          </span>
                        )}
                        {entries[selectedDate].periodo && (
                          <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                            Periodo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Síntomas físicos */}
                    {entries[selectedDate].sintomasFisicos && entries[selectedDate].sintomasFisicos.length > 0 && (
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <span className="font-semibold text-gray-700 block mb-2">Síntomas físicos:</span>
                        <div className="flex flex-wrap gap-2">
                          {entries[selectedDate].sintomasFisicos.map((sintoma) => (
                            <span key={sintoma} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                              {sintoma}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {entries[selectedDate].comentarios && (
                      <div className="bg-white p-4 rounded-lg">
                        <span className="font-semibold text-gray-700 block mb-2">Comentarios:</span>
                        <p className="text-gray-600">{entries[selectedDate].comentarios}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeView === 'estadisticas' && (
              <div>
                <div className="mb-6 bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Filtrar por fechas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha inicio</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha fin</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setDateRange({
                        start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0]
                      })}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                    >
                      Últimos 7 días
                    </button>
                    <button
                      onClick={() => setDateRange({
                        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0]
                      })}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                    >
                      Últimos 30 días
                    </button>
                    <button
                      onClick={() => setDateRange({
                        start: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0]
                      })}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                    >
                      Últimos 3 meses
                    </button>
                  </div>
                </div>

                {stats ? (
                  <div className="space-y-4">
                    {/* Resumen General */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      <button
                        onClick={() => toggleAccordion('resumen')}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                      >
                        <h3 className="text-xl font-bold text-gray-800">📊 Resumen General</h3>
                        {openAccordion === 'resumen' ? <ChevronUp className="w-6 h-6 text-purple-600" /> : <ChevronDown className="w-6 h-6 text-purple-600" />}
                      </button>
                      {openAccordion === 'resumen' && (
                        <div className="p-6">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                              Total de registros: <span className="text-purple-600 text-2xl">
                                {Object.entries(entries).filter(([date]) => date >= dateRange.start && date <= dateRange.end).length}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Del {new Date(dateRange.start + 'T00:00:00').toLocaleDateString('es-ES')} al {new Date(dateRange.end + 'T00:00:00').toLocaleDateString('es-ES')}
                            </p>
                          </div>

                          <div className="space-y-6">
                            {Object.keys(categories).map((category) => (
                              <div key={category} className="bg-gray-50 p-6 rounded-xl">
                                <h4 className="text-lg font-bold text-gray-800 mb-4">{categoryLabels[category]}</h4>
                                <div className="space-y-3">
                                  {categories[category].map((option) => {
                                    const count = stats[category][option] || 0;
                                    const total = Object.values(stats[category]).reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? (count / total) * 100 : 0;
                                    const colorStyle = getColorStyle(category, option);

                                    return (
                                      <div key={option} className="flex items-center gap-4">
                                        <span className="w-32 text-sm font-medium text-gray-700">{option}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                                          <div
                                            className={`h-full ${getColorForCategory(category, option)} transition-all duration-500 flex items-center justify-end pr-3`}
                                            style={{ width: `${percentage}%`, ...colorStyle }}
                                          >
                                            {count > 0 && (
                                              <span className="text-white text-sm font-bold">
                                                {count} ({percentage.toFixed(0)}%)
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}

                            {/* Estadísticas de checkboxes */}
                            <div className="bg-gray-50 p-6 rounded-xl">
                              <h4 className="text-lg font-bold text-gray-800 mb-4">Indicadores</h4>
                              <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-sm text-gray-600 mb-1">Despertares nocturnos</p>
                                  <p className="text-2xl font-bold text-blue-600">{stats.despertaresNocturnos.true} días</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-sm text-gray-600 mb-1">Sueños vívidos</p>
                                  <p className="text-2xl font-bold text-purple-600">{stats.suenosVividos.true} días</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                  <p className="text-sm text-gray-600 mb-1">Periodo</p>
                                  <p className="text-2xl font-bold text-pink-600">{stats.periodo.true} días</p>
                                </div>
                              </div>
                            </div>

                            {/* Síntomas físicos */}
                            {Object.keys(stats.sintomasFisicos).length > 0 && (
                              <div className="bg-gray-50 p-6 rounded-xl">
                                <h4 className="text-lg font-bold text-gray-800 mb-4">Síntomas Físicos</h4>
                                <div className="space-y-3">
                                  {Object.entries(stats.sintomasFisicos).map(([sintoma, count]) => {
                                    const total = Object.entries(entries).filter(([date]) => date >= dateRange.start && date <= dateRange.end).length;
                                    const percentage = total > 0 ? (count / total) * 100 : 0;
                                    return (
                                      <div key={sintoma} className="flex items-center gap-4">
                                        <span className="w-40 text-sm font-medium text-gray-700">{sintoma}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                                          <div
                                            className="h-full bg-red-500 transition-all duration-500 flex items-center justify-end pr-3"
                                            style={{ width: `${percentage}%` }}
                                          >
                                            <span className="text-white text-sm font-bold">
                                              {count} ({percentage.toFixed(0)}%)
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Gráficos de Tendencias */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      <button
                        onClick={() => toggleAccordion('graficos')}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                      >
                        <h3 className="text-xl font-bold text-gray-800">📈 Gráficos de Tendencias</h3>
                        {openAccordion === 'graficos' ? <ChevronUp className="w-6 h-6 text-purple-600" /> : <ChevronDown className="w-6 h-6 text-purple-600" />}
                      </button>
                      {openAccordion === 'graficos' && chartData && (
                        <div className="p-6">
                          <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="dolor" stroke="#ef4444" strokeWidth={2} name="Dolor" />
                              <Line type="monotone" dataKey="libido" stroke="#ec4899" strokeWidth={2} name="Libido" />
                              <Line type="monotone" dataKey="sueño" stroke="#10b981" strokeWidth={2} name="Sueño" />
                              <Line type="monotone" dataKey="ánimo" stroke="#f59e0b" strokeWidth={2} name="Ánimo" />
                              <Line type="monotone" dataKey="emoción" stroke="#a855f7" strokeWidth={2} name="Emoción" />
                              <Line type="monotone" dataKey="energía" stroke="#84cc16" strokeWidth={2} name="Energía" />
                              <Line type="monotone" dataKey="claridad" stroke="#06b6d4" strokeWidth={2} name="Claridad" />
                              <Line type="monotone" dataKey="motivación" stroke="#eab308" strokeWidth={2} name="Motivación" />
                              <Line type="monotone" dataKey="estrés" stroke="#f97316" strokeWidth={2} name="Estrés" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-lg">No hay registros en el rango de fechas seleccionado.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    
      {showCategoryModal && <CategoryModal />}
    </div>
  </>
);
};

export default HealthTrackerApp;