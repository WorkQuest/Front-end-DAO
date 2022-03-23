export default () => ({
  currentLang: '',
  twoFACode: '',
  userEnable2FA: {},
  userDisable2FA: {},
  tokens: {
    access: '',
    refresh: '',
  },
  userData: {
    statusKYC: false,
    id: '',
    avatarId: '',
    firstName: '',
    lastName: '',
    phone: {
      codeRegion: '',
      phone: '',
      fullPhone: '',
    },
    tempPhone: {
      codeRegion: '',
      phone: '',
      fullPhone: '',
    },
    email: '',
    role: '',
    location: {
      longitude: null,
      latitude: null,
    },
    wagePerHour: '',
    additionalInfo: {
      firstMobileNumber: {
        codeRegion: '',
        phone: '',
        fullPhone: '',
      },
      secondMobileNumber: {
        codeRegion: '',
        phone: '',
        fullPhone: '',
      },
      address: '',
      socialNetwork: {
        instagram: '',
        twitter: '',
        linkedin: '',
        facebook: '',
      },
      description: '',
      company: '',
      CEO: '',
      website: '',
      skills: [],
      educations: [],
      workExperiences: [],
      wallet: { address: null },
    },
    avatar: {
      id: '',
      url: '',
      contentType: '',
    },
    ratingStatistic: {
      id: '',
      userId: '',
      reviewCount: 0,
      averageMark: 0,
      status: '',
    },
    questsStatistic: {
      completed: 0,
      opened: 0,
    },
    chatStatistic: {
      id: '',
      userId: '',
      unreadCountChats: 0,
    },
    userSpecializations: [],
  },
  usersData: {
    users: [],
    count: 0,
  },
  currentUserPosition: null,
  userRole: {},
  userDataPassword: {},
  imageLink: {},
});
