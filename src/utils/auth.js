export function getLoggedInUserId(){
    try{
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return user?.id || user?._id || null;

    }catch{
        return null;
    }
}