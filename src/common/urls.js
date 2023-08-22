
// get host from fb.js file

// import Notifications from 'vue-notification';


let linkLetsChat = "/"
let linkDownloads = "/"
if (window.LINK_CONFIG){
	 linkLetsChat = window.LINK_CONFIG.linkLetsChat;
	 linkDownloads = window.LINK_CONFIG.linkDownloads;
}else{
	console.error("LINK_CONFIG not found")
}

let urlBackend = null;
let urlFrontend = null;

if (window.H_CONFIG) {
	urlBackend = window.H_CONFIG.hosts[window.H_CONFIG.useHostBackend];
	urlFrontend = window.H_CONFIG.hosts[window.H_CONFIG.useHostFrontend];
} else {
	console.error("LINK_CONFIG not found")
}
if (!window.FB_CONFIG) {
	console.error("FB_CONFIG not found")

}

export default {
	URL_SVG: "/img/svg/",
	URL_SIGNIN: urlFrontend + "/#/signin/",

	BASE_URL: urlBackend,
	BASE_API_URL: 'https://server882.herokuapp.com/'+urlBackend + '/api',

	GET_TOKEN: 'account/gettoken',
	USER_PROFILE: '/user/my',
	USER_INFO_UPDATE: '/user/update',
	CREATE_SYSTEM_ADMIN: '/user/create_system_admin',
	CREATE_USER: '/user/create',
	GET_NOTIFICATIONS: '/user/Notifications/',
	GET_NOTIFICATION: '/user/Notification/',
	READ_NOTIFICATION: 'user/Notifications/Read',
	READ_ALL_NOTIFICATIONS: 'user/Notifications/ReadAll',
	GET_GROUPS: '/group/admin/my',
	SEARCH_GROUPS: '/group/admin/search',
	GET_GROUP: '/group/',
	DELETE_GROUP: '/group/',
	ADMIN_GROUP: '/group/',
	GROUP_CREATE: '/group/create',
	GROUP_UPDATE: '/group/update',
	
	GET_EVENT: '/event/',
	EVENT_CREATE: '/event/create',
	EVENT_UPDATE: '/event/update',
	EVENT_DELETE: '/event/',
	GET_USERS: '/user/all',
	USERS_IMPORT: '/import/users',
	ZOOM_AUTH: '/Zoom/auth',
	ZOOM_DE_AUTH: '/Zoom/deauth',
	MEETING_CREATE: '/Event/Meeting/',
	MEETING_DELETE: '/Event/Meeting/',
	PUT_EVENT_ANSWER: '/Event/Answer/',

	GET_POST: '/post/',
	POST_CREATE: '/post/create',
	POST_UPDATE: '/post/update',
	POST_DELETE: '/post/',

	GROUP_JOIN: '/group/join/',
	GROUP_JOIN_CODE_ADD: '/group/joincodeadd/',

	LINK_LETS_CHAT: linkLetsChat,
	LINK_DOWNLOADS: linkDownloads,
}

export const NON_SIMPLE_URL = (options) => {
	const urls = {
		GET_EVENT_BY_ID: `/event/${options[1]}`,
		DUPLICATES_EVENT: `/event/${options[1]}/duplicate`,
		EVENT_PUBLISH: `/event/${options[1]}/publish`,
		EVENT_CANCEL: `/event/${options[1]}/cancel`,

		GET_GROUP_BY_ID: `/group/${options[1]}`,
		API_GROUP_MAKE_ADMIN: `/group/${options[1]}/makeadmin/${options[2]}`,
		API_GROUP_CANCEL_ADMIN: `/group/${options[1]}/canceladmin/${options[2]}`,
		ADD_GROUP_USER: `/group/${options[1]}/invite/${options[2]}`,
		API_GROUP_INVITE_EXTENDED: `/group/${options[1]}/Invite`,
		REMOVE_GROUP_USER: `/group/${options[1]}/remove/${options[2]}`,
		API_USER_DELETE: `/user/${options[1]}`,

		ADD_EVENT_USER: `/event/${options[1]}/add/${options[2]}`,
		REMOVE_EVENT_USER: `/event/${options[1]}/remove/${options[2]}`,
		PAY_EVENT_USER: `/event/${options[1]}/pay/${options[2]}`,

		GET_POST_BY_ID: `/post/${options[1]}`,
		DUPLICATES_POST: `/post/${options[1]}/duplicate`,
		POST_PUBLISH: `/post/${options[1]}/publish`,
		POST_CANCEL: `/post/${options[1]}/cancel`,

		GROUP_JOIN_CODE_ADD_BY_ID: `/Group/JoinCodeAdd?groupId=${options[1]}`,
		GROUP_JOIN_CODE_REMOVE_BY_ID: `/Group/JoinCodeRemove?groupId=${options[1]}`,
		PUBLIC_GROUP_GET_INFO: `/group/${options[1]}/info`,

		EVENT_UPDATE_RECURRING: `/event/update?changeType=${options[1]}`,

	}

	return urls[options[0]]
}
