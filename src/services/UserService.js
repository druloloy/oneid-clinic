import Api, {baseURL} from './Api';
const loginUser = async (username, password) => {
    const response = await Api.post(`login`, { username, password });
    return response.data;
}
const logoutUser = async () => {
    const response = await Api.post(`logout`);
    return response.data;
}
const me = async () => {
    const response = await Api.get(`me`);
    return response.data;
}

const getPatientLogin = async (id) => {
    const q = `?patient_id=${id}`;
    const response = await Api.get(`patient/l${q}`);
    return response.data;
}
const getPatientDetails = async (id) => {
    const q = `?patient_id=${id}`;
    const response = await Api.get(`patient/d${q}`);
    return response.data;
}
const getPatientMedical = async (id) => {
    const q = `?patient_id=${id}`;
    const response = await Api.get(`patient/m${q}`);
    return response.data;
}
const getPatientConsultations = async (id) => {
    const q = `?patient_id=${id}`;
    const response = await Api.get(`patient/c${q}`);
    return response.data;
}

const consultPatient = async (id, data) => {
    const q = `?patient_id=${id}`;
    const response = await Api.post(`consult${q}`, data);
    return response.data;
}

const encrypt = async (s) => {
    const q = `?s=${s}`;
    const response = await Api.get(`encrypt${q}`, {
        baseURL: baseURL+'security/'
    });
    return response.data;
}

const decrypt = async (s) => {
    const q = `?s=${s}`;
    const response = await Api.get(`decrypt${q}`, {
        baseURL: baseURL+'security/'
    });
    return response.data;
}

const UserService = {
    loginUser,
    logoutUser,
    me,
    getPatientLogin,
    getPatientDetails,
    getPatientMedical,
    getPatientConsultations,
    consultPatient,
    encrypt,
    decrypt
}

export default UserService;