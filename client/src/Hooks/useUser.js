import { useContext, useState, useEffect } from "react";
import { UserContext } from '../Context/user/index'

export function useUserInfo() {
    const [userState, dispatch] = useContext(UserContext)
    
    function getUserInfo() {
        return userState
    }

    const [info, setInfo] = useState(getUserInfo().userInfo)
    
    useEffect(() => {
        setInfo(userState.userInfo)
    }, [userState.userInfo])


    function setUserInfo(payload) {
        setInfo(payload)
        dispatch({ type: 'setUserInfo', payload });
    }

    return {
        userInfo: info,
        setUserInfo
    }
}