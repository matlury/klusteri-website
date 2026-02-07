import axiosClient from '../axios.js';

// Authentication API
export const authAPI = {
  login: (credentials) => axiosClient.post('token/', credentials),
  getUserInfo: () => axiosClient.get('users/userinfo'),
};

// Users API
export const usersAPI = {
  updateUser: (userId, data) => axiosClient.put(`users/update/${userId}/`, data),
  registerUser: (userData) => axiosClient.post('users/register', userData),
  changeReservationRights: (userId) => axiosClient.put(`users/change_rights_reservation/${userId}/`),
  getUsers: (params = '') => axiosClient.get(`listobjects/users/${params}`),
  getUsersByTelegram: (telegram) => axiosClient.get(`listobjects/users/?telegram=${telegram}`),
  getUsersByEmail: (email) => axiosClient.get(`listobjects/users/?email=${email}`),
};

// Organizations API
export const organizationsAPI = {
  getOrganizations: () => axiosClient.get('listobjects/organizations/'),
  organizationsWithKeys: () => axiosClient.get('listobjects/organizations/?include_user_count=true'),
  getOrganizationsByEmail: (email) => axiosClient.get(`listobjects/organizations/?email=${email}`),
  createOrganization: (orgData) => axiosClient.post('organizations/create', orgData),
  updateOrganization: (orgId, data) => axiosClient.put(`organizations/update_organization/${orgId}/`, data),
  deleteOrganization: (orgId) => axiosClient.delete(`organizations/remove/${orgId}/`),
};

// Events API
export const eventsAPI = {
  getEvents: (params = '') => axiosClient.get(`listobjects/events/${params}`),
  getEventsWithParams: (params) => axiosClient.get(`listobjects/events/?${params.toString()}`),
  getEventsWithQuery: (params) => axiosClient.get('listobjects/events/', { params }),
  createEvent: (eventData) => axiosClient.post('events/create_event', eventData),
  deleteEvent: (eventId) => axiosClient.delete(`events/delete_event/${eventId}/`),
};

// Night Responsibilities API
export const nightResponsibilitiesAPI = {
  getNightResponsibilities: () => axiosClient.get('listobjects/nightresponsibilities/'),
};

// YKV (Night Watch) API
export const ykvAPI = {
  createResponsibility: (responsibilityData) => axiosClient.post('ykv/create_responsibility', responsibilityData),
  logoutResponsibility: (responsibilityId, data) => axiosClient.put(`ykv/logout_responsibility/${responsibilityId}/`, data),
  getEligibleUsers: () => axiosClient.get('users/ykv/'),
};

// Keys API
export const keysAPI = {
  handOverKey: (userId, data) => axiosClient.put(`keys/hand_over_key/${userId}/`, data),
};

// Defects API
export const defectsAPI = {
  getDefects: () => axiosClient.get('listobjects/defects/'),
  createDefect: (defectData) => axiosClient.post('defects/create_defect', defectData),
  repairDefect: (id) => axiosClient.put(`defects/repair_defect/${id}/`, {}),
  emailDefect: (id) => axiosClient.put(`defects/email_defect/${id}/`, {}),
};

// Cleaning Supplies API
export const cleaningSuppliesAPI = {
  getCleaningSupplies: () => axiosClient.get('listobjects/cleaningsupplies/'),
  createTool: (toolData) => axiosClient.post('cleaningsupplies/create_tool', toolData),
  deleteTool: (toolId) => axiosClient.delete(`cleaningsupplies/delete_tool/${toolId}/`),
};

// Cleaning API
export const cleaningAPI = {
  getCleaning: () => axiosClient.get('listobjects/cleaning/'),
  createCleaning: (cleaningData) => axiosClient.post('cleaning/create_cleaning', cleaningData),
  deleteAllCleaning: () => axiosClient.delete('cleaning/remove/all'),
};

// Generic list objects API for common patterns
export const listObjectsAPI = {
  getUsers: () => axiosClient.get('listobjects/users/'),
  getOrganizations: () => axiosClient.get('listobjects/organizations/'),
  getEvents: () => axiosClient.get('listobjects/events/'),
  getNightResponsibilities: () => axiosClient.get('listobjects/nightresponsibilities/'),
  getDefects: () => axiosClient.get('listobjects/defects/'),
};