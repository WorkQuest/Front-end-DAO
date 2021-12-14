export default {
  getInvestorsList: (state) => state.investors.list,
  getInvestorsCount: (state) => state.investors.count,

  isAuth: (state) => !!(state.tokens.access && state.tokens.refresh),
  accessToken: (state) => state.tokens.access,
  refreshToken: (state) => state.tokens.refresh,
  getUserData: (state) => state.userData,
  editUserData: (state) => state.userData || '',
  getAdditionalInfo: (state) => state.userData?.additionalInfo?.socialNetwork || '',
  getAdditionalInfoInstagram: (state) => state.userData?.additionalInfo?.socialNetwork?.instagram || '',
  getUserRole: (state) => state.userData?.role,
  getUserCurrentPosition: (state) => state.currentUserPosition || null,
  getImageData: (state) => state.userData?.avatar?.url || null,
  getFirstName: (state) => state.userData?.firstName || '',
  getLastName: (state) => state.userData?.lastName || '',
  getUserCompany: (state) => state.userData?.additionalInfo?.company || '',
  getUserDesc: (state) => state.userData?.additionalInfo?.description || '',
  getUserEducations: (state) => state.userData?.additionalInfo?.educations || '',
  getUserWorkExp: (state) => state.userData?.additionalInfo?.workExperiences || '',
  getUserAddress: (state) => state.userData?.additionalInfo?.address || '',
  getUserFirstMobileNumber: (state) => state.userData?.additionalInfo?.firstMobileNumber || '',
  getUserSecondMobileNumber: (state) => state.userData?.additionalInfo?.secondMobileNumber || '',
  getUserEmail: (state) => state.userData?.email || '',
  getUserCEO: (state) => state.userData?.additionalInfo?.CEO || '',
  getUserWebsite: (state) => state.userData?.additionalInfo?.website || '',
  getUserInstagram: (state) => state.userData?.additionalInfo?.socialNetwork?.instagram || '',
  getUserTwitter: (state) => state.userData?.additionalInfo?.socialNetwork?.twitter || '',
  getUserLinkedin: (state) => state.userData?.additionalInfo?.socialNetwork?.linkedin || '',
  getUserFacebook: (state) => state.userData?.additionalInfo?.socialNetwork?.facebook || '',
  getUserWorkQuest: (state) => state.userData?.additionalInfo?.socialNetwork?.workQuest || '',
  isProfileEdit: (state) => state.isProfileEdit,
};