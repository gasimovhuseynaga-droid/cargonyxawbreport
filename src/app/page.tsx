'use client'

import { useEffect, useMemo, useState } from 'react'

type Language = 'ru' | 'az' | 'en'
type CourierCode = 'UNITED' | 'LIMAK' | 'AZERPOCT' | 'DEMIR' | 'STAREX'

type User = {
  id: string
  firstName: string
  lastName: string
  username: string
  password: string
  createdAt: string
}

type Waybill = {
  id: string
  number: string
  courier: CourierCode
  boxesCount: number
  weightKg: number
  createdAt: string
  createdBy: string
  createdByUserId: string
  notes: string
}

const couriers: CourierCode[] = ['UNITED', 'LIMAK', 'AZERPOCT', 'DEMIR', 'STAREX']

const translations = {
  ru: {
    appTitle: 'CARGONYX WHS AWB REPORT',
    reportTitle: 'Отчёт по накладным',
    register: 'Регистрация',
    login: 'Вход',
    createAccount: 'Создать кабинет',
    signIn: 'Войти',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Телефон',
    password: 'Пароль',
    createPassword: 'Придумай пароль',
    loginHint: 'Имя и фамилия, как при регистрации',
    afterRegister: 'Регистрация один раз, потом вход по имени и паролю',
    authInfo1: 'регистрация по имени, фамилии, номеру телефона и паролю',
    authInfo2: 'после регистрации вход по имени и паролю',
    authInfo3: 'номер накладной автоматически форматируется как 860-05498415',
    authInfo4: 'выбор даты через календарь',
    authInfo5: 'поиск по номеру накладной и по дате',
    authInfo6: 'внизу график коробок по месяцам',
    allWaybills: 'Всего накладных',
    allBoxes: 'Всего коробок',
    todayBoxes: 'Сегодня коробок',
    monthBoxes: 'За месяц коробок',
    monthWeight: 'За месяц вес',
    addWaybill: 'Добавить накладную',
    allWaybillsList: 'Все накладные',
    awbPlaceholder: 'Номер накладной, например 860-05498415',
    boxesCount: 'Количество коробок',
    weightKg: 'Вес, кг',
    comment: 'Комментарий',
    saveWaybill: 'Сохранить накладную',
    searchAwb: 'Поиск по номеру накладной',
    allCouriers: 'Все курьеры',
    reset: 'Сбросить',
    noWaybills: 'Накладные не найдены',
    boxes: 'Коробки',
    weight: 'Вес',
    addedBy: 'Внёс',
    date: 'Дата',
    commentLabel: 'Комментарий',
    delete: 'Удалить',
    logout: 'Выйти',
    chartTitle: 'График коробок по месяцам',
    chartEmpty: 'Нет данных для графика',
    fillAll: 'Заполни все поля',
    needAzPhone: 'Нужен азербайджанский номер, начиная с +994',
    userExists: 'Такой пользователь уже зарегистрирован',
    wrongLogin: 'Неверное имя или пароль',
    fillWaybill: 'Заполни номер накладной, курьера, коробки, вес и дату',
    onlyOwnerDelete: 'Удалять может только тот, кто внёс запись',
    confirmDelete: 'Удалить эту накладную?'
  },
  az: {
    appTitle: 'CARGONYX WHS AWB REPORT',
    reportTitle: 'Qaimələr üzrə hesabat',
    register: 'Qeydiyyat',
    login: 'Giriş',
    createAccount: 'Kabinet yarat',
    signIn: 'Daxil ol',
    firstName: 'Ad',
    lastName: 'Soyad',
    phone: 'Telefon',
    password: 'Şifrə',
    createPassword: 'Şifrə yarat',
    loginHint: 'Qeydiyyatda yazdığın ad və soyad',
    afterRegister: 'Bir dəfə qeydiyyat, sonra ad və şifrə ilə giriş',
    authInfo1: 'ad, soyad, telefon nömrəsi və şifrə ilə qeydiyyat',
    authInfo2: 'qeydiyyatdan sonra ad və şifrə ilə giriş',
    authInfo3: 'qaimə nömrəsi avtomatik 860-05498415 kimi formatlanır',
    authInfo4: 'tarix təqvimlə seçilir',
    authInfo5: 'qaimə nömrəsi və tarix üzrə axtarış',
    authInfo6: 'aşağıda aylar üzrə qutu qrafiki',
    allWaybills: 'Cəmi qaimə',
    allBoxes: 'Cəmi qutu',
    todayBoxes: 'Bugünkü qutu',
    monthBoxes: 'Ay üzrə qutu',
    monthWeight: 'Ay üzrə çəki',
    addWaybill: 'Qaimə əlavə et',
    allWaybillsList: 'Bütün qaimələr',
    awbPlaceholder: 'Qaimə nömrəsi, məsələn 860-05498415',
    boxesCount: 'Qutu sayı',
    weightKg: 'Çəki, kq',
    comment: 'Qeyd',
    saveWaybill: 'Qaiməni saxla',
    searchAwb: 'Qaimə nömrəsi ilə axtar',
    allCouriers: 'Bütün kuryerlər',
    reset: 'Sıfırla',
    noWaybills: 'Qaimə tapılmadı',
    boxes: 'Qutular',
    weight: 'Çəki',
    addedBy: 'Daxil edən',
    date: 'Tarix',
    commentLabel: 'Qeyd',
    delete: 'Sil',
    logout: 'Çıxış',
    chartTitle: 'Aylar üzrə qutu qrafiki',
    chartEmpty: 'Qrafik üçün məlumat yoxdur',
    fillAll: 'Bütün xanaları doldur',
    needAzPhone: '+994 ilə başlayan Azərbaycan nömrəsi lazımdır',
    userExists: 'Bu istifadəçi artıq qeydiyyatdan keçib',
    wrongLogin: 'Ad və ya şifrə səhvdir',
    fillWaybill: 'Qaimə nömrəsi, kuryer, qutu sayı, çəki və tarixi doldur',
    onlyOwnerDelete: 'Yalnız daxil edən şəxs silə bilər',
    confirmDelete: 'Bu qaimə silinsin?'
  },
  en: {
    appTitle: 'CARGONYX WHS AWB REPORT',
    reportTitle: 'Waybill report',
    register: 'Register',
    login: 'Login',
    createAccount: 'Create account',
    signIn: 'Sign in',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone',
    password: 'Password',
    createPassword: 'Create password',
    loginHint: 'Same first and last name used at registration',
    afterRegister: 'Register once, then sign in with name and password',
    authInfo1: 'registration with first name, last name, phone number and password',
    authInfo2: 'after registration, login with name and password',
    authInfo3: 'waybill number auto-formats like 860-05498415',
    authInfo4: 'date is selected from calendar',
    authInfo5: 'search by waybill number and date',
    authInfo6: 'monthly boxes chart at the bottom',
    allWaybills: 'Total waybills',
    allBoxes: 'Total boxes',
    todayBoxes: 'Boxes today',
    monthBoxes: 'Boxes this month',
    monthWeight: 'Weight this month',
    addWaybill: 'Add waybill',
    allWaybillsList: 'All waybills',
    awbPlaceholder: 'Waybill number, for example 860-05498415',
    boxesCount: 'Boxes count',
    weightKg: 'Weight, kg',
    comment: 'Comment',
    saveWaybill: 'Save waybill',
    searchAwb: 'Search by waybill number',
    allCouriers: 'All couriers',
    reset: 'Reset',
    noWaybills: 'No waybills found',
    boxes: 'Boxes',
    weight: 'Weight',
    addedBy: 'Added by',
    date: 'Date',
    commentLabel: 'Comment',
    delete: 'Delete',
    logout: 'Logout',
    chartTitle: 'Monthly boxes chart',
    chartEmpty: 'No data for chart',
    fillAll: 'Fill in all fields',
    needAzPhone: 'Use an Azerbaijani phone number starting with +994',
    userExists: 'This user is already registered',
    wrongLogin: 'Wrong name or password',
    fillWaybill: 'Fill in waybill number, courier, boxes, weight and date',
    onlyOwnerDelete: 'Only the author can delete this record',
    confirmDelete: 'Delete this waybill?'
  }
} as const

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#dbeafe',
  color: '#0f172a',
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #bfdbfe',
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid #93c5fd',
  background: '#eff6ff',
  color: '#0f172a',
  outline: 'none',
}

const buttonStyle: React.CSSProperties = {
  padding: '12px 18px',
  borderRadius: 12,
  border: 'none',
  cursor: 'pointer',
  background: '#2563eb',
  color: '#ffffff',
  fontWeight: 700,
}

const secondaryButton: React.CSSProperties = {
  ...buttonStyle,
  background: '#e2e8f0',
  color: '#0f172a',
}

const dangerButton: React.CSSProperties = {
  ...buttonStyle,
  background: '#dc2626',
  color: '#ffffff',
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

function normalizeAzPhone(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

function slugifyUsername(firstName: string, lastName: string) {
  return `${firstName.trim()} ${lastName.trim()}`.toLowerCase()
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function getDateOnly(dateString: string) {
  return new Date(dateString).toISOString().slice(0, 10)
}

function getMonthKey(dateString: string) {
  return new Date(dateString).toISOString().slice(0, 7)
}

function formatAwbNumber(value: string) {
  const cleaned = value.replace(/\D/g, '')
  const first = cleaned.slice(0, 3)
  const rest = cleaned.slice(3, 11)

  if (!first) return ''
  if (cleaned.length <= 3) return first
  return `${first}-${rest}`
}

function monthLabel(monthKey: string, lang: Language) {
  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)

  return date.toLocaleDateString(
    lang === 'az' ? 'az-AZ' : lang === 'en' ? 'en-US' : 'ru-RU',
    { month: 'short', year: 'numeric' }
  )
}
function isWaybillOwnedByCurrentUser(
  waybill: {
    createdByUserId?: string
    createdBy: string
  },
  currentUser: {
    id: string
    firstName: string
    lastName: string
  } | null
) {
  if (!currentUser) return false

  if (waybill.createdByUserId === currentUser.id) return true

  const fullName =
    `${currentUser.firstName} ${currentUser.lastName}`.trim().toLowerCase()

  return (waybill.createdBy || '').trim().toLowerCase() === fullName
}
export default function Home() {
  const [language, setLanguage] = useState<Language>('ru')
  const t = translations[language]

  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [users, setUsers] = useState<User[]>([])
  const [waybills, setWaybills] = useState<Waybill[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isMobile, setIsMobile] = useState(false)



  const [editingWaybillId, setEditingWaybillId] = useState<string | null>(null)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768)
    }


    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])



  useEffect(() => {
    const savedUsers = localStorage.getItem('users')
    const savedCurrentUser = localStorage.getItem('currentUser')

    if (savedUsers) setUsers(JSON.parse(savedUsers))
    if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser))
  }, [])

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
  })
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })

  const [waybillForm, setWaybillForm] = useState({
    number: '',
    courier: 'STAREX' as CourierCode,
    boxesCount: '',
    weightKg: '',
    enteredDate: getTodayDate(),
    notes: '',
  })

  const [searchNumber, setSearchNumber] = useState('')
  const [filterCourier, setFilterCourier] = useState<'ALL' | CourierCode>('ALL')
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => {
    const savedUsers = localStorage.getItem('cargonyx_users')
    const savedWaybills = localStorage.getItem('cargonyx_waybills')
    const savedCurrentUser = localStorage.getItem('cargonyx_current_user')
    const savedLanguage = localStorage.getItem('cargonyx_language')

    if (savedUsers) setUsers(JSON.parse(savedUsers))
    if (savedWaybills) setWaybills(JSON.parse(savedWaybills))
    if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser))
    if (savedLanguage === 'ru' || savedLanguage === 'az' || savedLanguage === 'en') {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cargonyx_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('cargonyx_waybills', JSON.stringify(waybills))
  }, [waybills])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cargonyx_current_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('cargonyx_current_user')
    }
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem('cargonyx_language', language)
  }, [language])

  const filteredWaybills = useMemo(() => {
    return waybills.filter((item) => {
      const matchesNumber = item.number.toLowerCase().includes(searchNumber.toLowerCase())
      const matchesCourier = filterCourier === 'ALL' ? true : item.courier === filterCourier
      const matchesDate = filterDate ? getDateOnly(item.createdAt) === filterDate : true

      return matchesNumber && matchesCourier && matchesDate
    })
  }, [waybills, searchNumber, filterCourier, filterDate])

  const summary = useMemo(() => {
    return {
      totalWaybills: waybills.length,
      totalBoxes: waybills.reduce((sum, item) => sum + item.boxesCount, 0),
      totalWeight: waybills.reduce((sum, item) => sum + item.weightKg, 0),
    }
  }, [waybills])

  const dailySummary = useMemo(() => {
    const today = getTodayDate()
    const todayItems = waybills.filter((item) => getDateOnly(item.createdAt) === today)

    return {
      waybills: todayItems.length,
      boxes: todayItems.reduce((sum, item) => sum + item.boxesCount, 0),
      weight: todayItems.reduce((sum, item) => sum + item.weightKg, 0),
    }
  }, [waybills])

  const monthlySummary = useMemo(() => {
    const month = getMonthKey(new Date().toISOString())
    const monthItems = waybills.filter((item) => getMonthKey(item.createdAt) === month)

    return {
      waybills: monthItems.length,
      boxes: monthItems.reduce((sum, item) => sum + item.boxesCount, 0),
      weight: monthItems.reduce((sum, item) => sum + item.weightKg, 0),
    }
  }, [waybills])

  const monthlyChartData = useMemo(() => {
    const grouped = new Map<string, number>()

    waybills.forEach((item) => {
      const key = getMonthKey(item.createdAt)
      grouped.set(key, (grouped.get(key) || 0) + item.boxesCount)
    })

    const result = Array.from(grouped.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, boxes]) => ({ month, boxes }))

    return result
  }, [waybills])

  const maxChartValue = useMemo(() => {
    if (monthlyChartData.length === 0) return 1
    return Math.max(...monthlyChartData.map((item) => item.boxes))
  }, [monthlyChartData])

  function handleRegister() {
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.password) {
      alert(t.fillAll)
      return
    }

    const username = slugifyUsername(registerForm.firstName, registerForm.lastName)

    const exists = users.find((u) => u.username === username)

    if (exists) {
      alert(t.userExists)
      return
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      username,
      password: registerForm.password,
      createdAt: new Date().toISOString(),
    }

    setUsers([...users, newUser])
    setCurrentUser(newUser)

    setRegisterForm({
      firstName: '',
      lastName: '',
      password: '',
    })
  }
  function handleLogin() {
    const username = loginForm.username.trim().toLowerCase()

    const user = users.find(
      (u) => u.username === username && u.password === loginForm.password
    )

    if (!user) {
      alert(t.wrongLogin)
      return
    }

    setCurrentUser(user)
    setLoginForm({
      username: '',
      password: '',
    })
  }

  function handleLogout() {
    setCurrentUser(null)
  }

  function handleAddWaybill() {
    if (!currentUser) return

    if (
      !waybillForm.number ||
      !waybillForm.courier ||
      !waybillForm.boxesCount ||
      !waybillForm.weightKg ||
      !waybillForm.enteredDate
    ) {
      alert(t.fillWaybill)
      return
    }

    if (editingWaybillId) {
      setWaybills((prev) =>
        prev.map((item) =>
          item.id === editingWaybillId
            ? {
              ...item,
              number: waybillForm.number,
              courier: waybillForm.courier,
              boxesCount: Number(waybillForm.boxesCount),
              weightKg: Number(waybillForm.weightKg),
              notes: waybillForm.notes,
              createdAt: new Date(`${waybillForm.enteredDate}T12:00:00`).toISOString(),
            }
            : item
        )
      )

      setEditingWaybillId(null)

      setWaybillForm({
        number: '',
        courier: 'STAREX',
        boxesCount: '',
        weightKg: '',
        enteredDate: getTodayDate(),
        notes: '',
      })

      return
    }

    const newWaybill: Waybill = {
      id: crypto.randomUUID(),
      number: waybillForm.number,
      courier: waybillForm.courier,
      boxesCount: Number(waybillForm.boxesCount),
      weightKg: Number(waybillForm.weightKg),
      notes: waybillForm.notes,
      createdAt: new Date(`${waybillForm.enteredDate}T12:00:00`).toISOString(),
      createdBy: `${currentUser.firstName} ${currentUser.lastName}`,
      createdByUserId: currentUser.id,
    }

    setWaybills([newWaybill, ...waybills])

    setWaybillForm({
      number: '',
      courier: 'STAREX',
      boxesCount: '',
      weightKg: '',
      enteredDate: getTodayDate(),
      notes: '',
    })
  }

  function handleEditWaybill(item: Waybill) {
    if (!currentUser) return

    if (!isWaybillOwnedByCurrentUser(item, currentUser)) {
      alert(t.onlyOwnerDelete)
      return
    }

    setEditingWaybillId(item.id)

    setWaybillForm({
      number: item.number,
      courier: item.courier,
      boxesCount: String(item.boxesCount),
      weightKg: String(item.weightKg),
      enteredDate: getDateOnly(item.createdAt),
      notes: item.notes || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {

    setEditingWaybillId(null)

    setWaybillForm({
      number: '',
      courier: 'STAREX',
      boxesCount: '',
      weightKg: '',
      enteredDate: getTodayDate(),
      notes: '',
    })
  }
  function handleDeleteWaybill(id: string) {
    if (!currentUser) return

    const target = waybills.find((item) => item.id === id)
    if (!target) return

    if (!isWaybillOwnedByCurrentUser(target, currentUser)) {
      alert(t.onlyOwnerDelete)
      return
    }

    const confirmDelete = window.confirm(t.confirmDelete)
    if (!confirmDelete) return

    setWaybills(waybills.filter((item) => item.id !== id))
  }

  if (!currentUser) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '30px 20px 60px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 40 }}>{t.reportTitle}</h1>
              <p style={{ margin: '8px 0 0', color: '#334155' }}>{t.afterRegister}</p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: 24 }}>
                {t.appTitle}
              </div>

              <select
                style={{ ...inputStyle, width: 120, background: '#ffffff' }}
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="az">AZ</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
              </select>

              <img
                src="/cargonyx-logo.png"
                alt="CargoNYX"
                style={{
                  width: 150,
                  height: 'auto',
                  background: '#fff',
                  padding: 6,
                  borderRadius: 12,
                  border: '1px solid #bfdbfe',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.2fr 460px',
              gap: 24,
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                minHeight: 520,
                border: '1px solid #bfdbfe',
                borderRadius: 20,
                padding: 20,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.15), rgba(255,255,255,0.15)), url('/warehouse-side.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  border: '1px solid #bfdbfe',
                  borderRadius: 16,
                  padding: 18,
                  maxWidth: 540,
                }}
              >
                <h2 style={{ marginTop: 0 }}>{t.reportTitle}</h2>
                <div style={{ lineHeight: 1.8, color: '#334155' }}>
                  <div>• {t.authInfo1}</div>
                  <div>• {t.authInfo2}</div>
                  <div>• {t.authInfo3}</div>
                  <div>• {t.authInfo4}</div>
                  <div>• {t.authInfo5}</div>
                  <div>• {t.authInfo6}</div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button
                  onClick={() => setMode('register')}
                  style={mode === 'register' ? buttonStyle : secondaryButton}
                >
                  {t.register}
                </button>
                <button
                  onClick={() => setMode('login')}
                  style={mode === 'login' ? buttonStyle : secondaryButton}
                >
                  {t.login}
                </button>
              </div>

              {mode === 'register' ? (
                <div>
                  <h2 style={{ marginTop: 0 }}>{t.createAccount}</h2>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <input
                      style={inputStyle}
                      placeholder={t.firstName}
                      value={registerForm.firstName}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, firstName: e.target.value })
                      }
                    />
                    <input
                      style={inputStyle}
                      placeholder={t.lastName}
                      value={registerForm.lastName}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, lastName: e.target.value })
                      }
                    />

                    <input
                      style={inputStyle}
                      placeholder={t.createPassword}
                      type="password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, password: e.target.value })
                      }
                    />
                    <button onClick={handleRegister} style={buttonStyle}>
                      {t.register}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 style={{ marginTop: 0 }}>{t.signIn}</h2>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <input
                      style={inputStyle}
                      placeholder={t.loginHint}
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    />
                    <input
                      style={inputStyle}
                      placeholder={t.password}
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                    <button onClick={handleLogin} style={buttonStyle}>
                      {t.login}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1500, margin: '0 auto', padding: '24px 20px 60px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>{t.reportTitle}</h1>
            <div style={{ color: '#334155', marginTop: 4 }}>
              {currentUser.firstName} {currentUser.lastName}
            </div>

            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 800, fontSize: 22, color: '#1d4ed8' }}>
                CARGONYX WHS
              </div>

              <select
                style={{ ...inputStyle, width: 120, background: '#ffffff' }}
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="az">AZ</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
              </select>

              <img
                src="/cargonyx-logo.png"
                alt="CargoNYX"
                style={{
                  width: 140,
                  height: 'auto',
                  background: '#fff',
                  padding: 6,
                  borderRadius: 12,
                  border: '1px solid #bfdbfe',
                }}
              />

              <button onClick={handleLogout} style={secondaryButton}>
                {t.logout}
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, minmax(0, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={cardStyle}>
              <div style={{ color: '#475569' }}>{t.allWaybills}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{summary.totalWaybills}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#475569' }}>{t.allBoxes}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{summary.totalBoxes}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#475569' }}>{t.todayBoxes}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{dailySummary.boxes}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#475569' }}>{t.monthBoxes}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{monthlySummary.boxes}</div>
            </div>
            <div style={cardStyle}>
              <div style={{ color: '#475569' }}>{t.monthWeight}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{monthlySummary.weight} кг</div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '420px 1fr',
              gap: 24,
              alignItems: 'start',
            }}
          >
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>{t.addWaybill}</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <input
                  style={inputStyle}
                  placeholder={t.awbPlaceholder}
                  value={waybillForm.number}
                  onChange={(e) =>
                    setWaybillForm({
                      ...waybillForm,
                      number: formatAwbNumber(e.target.value),
                    })
                  }
                />

                <select
                  style={inputStyle}
                  value={waybillForm.courier}
                  onChange={(e) =>
                    setWaybillForm({ ...waybillForm, courier: e.target.value as CourierCode })
                  }
                >
                  {couriers.map((courier) => (
                    <option key={courier} value={courier}>
                      {courier}
                    </option>
                  ))}
                </select>

                <input
                  style={inputStyle}
                  placeholder={t.boxesCount}
                  type="number"
                  value={waybillForm.boxesCount}
                  onChange={(e) =>
                    setWaybillForm({ ...waybillForm, boxesCount: e.target.value })
                  }
                />

                <input
                  style={inputStyle}
                  placeholder={t.weightKg}
                  type="number"
                  value={waybillForm.weightKg}
                  onChange={(e) =>
                    setWaybillForm({ ...waybillForm, weightKg: e.target.value })
                  }
                />

                <input
                  className="dark-calendar-input"
                  style={inputStyle}
                  type="date"
                  value={waybillForm.enteredDate}
                  onChange={(e) =>
                    setWaybillForm({ ...waybillForm, enteredDate: e.target.value })
                  }
                />

                <textarea
                  style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                  placeholder={t.comment}
                  value={waybillForm.notes}
                  onChange={(e) => setWaybillForm({ ...waybillForm, notes: e.target.value })}
                />

                <button onClick={handleAddWaybill} style={buttonStyle}>
                  {t.saveWaybill}
                </button>
              </div>
            </div>

            <div style={cardStyle}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 16,
                }}
              >
                <h2 style={{ margin: 0 }}>{t.allWaybillsList}</h2>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <input
                    style={{ ...inputStyle, width: 240 }}
                    placeholder={t.searchAwb}
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(formatAwbNumber(e.target.value))}
                  />

                  <input
                    className="dark-calendar-input"
                    style={{ ...inputStyle, width: 170 }}
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />

                  <select
                    style={{ ...inputStyle, width: 160 }}
                    value={filterCourier}
                    onChange={(e) =>
                      setFilterCourier(e.target.value as 'ALL' | CourierCode)
                    }
                  >
                    <option value="ALL">{t.allCouriers}</option>
                    {couriers.map((courier) => (
                      <option key={courier} value={courier}>
                        {courier}
                      </option>
                    ))}
                  </select>

                  <button
                    style={secondaryButton}
                    onClick={() => {
                      setSearchNumber('')
                      setFilterDate('')
                      setFilterCourier('ALL')
                    }}
                  >
                    {t.reset}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {filteredWaybills.length === 0 ? (
                  <div style={{ color: '#475569' }}>{t.noWaybills}</div>
                ) : (
                  filteredWaybills.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: '1px solid #cbd5e1',
                        borderRadius: 16,
                        padding: 16,
                        background: '#eff6ff',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 12,
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{item.number}</div>

                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                          <div
                            style={{
                              background: '#dbeafe',
                              color: '#1d4ed8',
                              padding: '6px 10px',
                              borderRadius: 999,
                              fontWeight: 700,
                            }}
                          >
                            {item.courier}
                          </div>

                          {isWaybillOwnedByCurrentUser(item, currentUser) ? (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => handleEditWaybill(item)}
                                title="Редактировать"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 10,
                                  border: '1px solid #93c5fd',
                                  background: '#ffffff',
                                  cursor: 'pointer',
                                  fontSize: 18,
                                }}
                              >
                                ✏️
                              </button>

                              <button
                                onClick={() => handleDeleteWaybill(item.id)}
                                title="Удалить"
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 10,
                                  border: '1px solid #fca5a5',
                                  background: '#ffffff',
                                  cursor: 'pointer',
                                  fontSize: 18,
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                          gap: 10,
                          marginTop: 14,
                          color: '#1e293b',
                        }}
                      >
                        <div>{t.boxes}: <strong>{item.boxesCount}</strong></div>
                        <div>{t.weight}: <strong>{item.weightKg} кг</strong></div>
                        <div>{t.addedBy}: <strong>{item.createdBy}</strong></div>
                        <div>{t.date}: <strong>{formatDate(item.createdAt)}</strong></div>
                      </div>

                      {item.notes ? (
                        <div style={{ marginTop: 12, color: '#475569' }}>
                          {t.commentLabel}: <strong>{item.notes}</strong>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, marginTop: 24 }}>
            <h2 style={{ marginTop: 0, marginBottom: 18 }}>{t.chartTitle}</h2>

            {monthlyChartData.length === 0 ? (
              <div style={{ color: '#475569' }}>{t.chartEmpty}</div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: 18,
                  minHeight: 280,
                  paddingTop: 20,
                  overflowX: 'auto',
                }}
              >
                {monthlyChartData.map((item) => {
                  const height = Math.max(40, (item.boxes / maxChartValue) * 220)

                  return (
                    <div
                      key={item.month}
                      style={{
                        minWidth: 110,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#334155' }}>{item.boxes}</div>

                      <div
                        style={{
                          width: 84,
                          height,
                          background: '#6ea9a7',
                          borderRadius: '12px 12px 0 0',
                          boxShadow: '0 6px 18px rgba(15,23,42,0.12)',
                        }}
                      />

                      <div
                        style={{
                          textAlign: 'center',
                          fontSize: 14,
                          color: '#334155',
                          lineHeight: 1.3,
                        }}
                      >
                        {monthLabel(item.month, language)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}