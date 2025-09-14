import fetch from 'node-fetch'

export const getCityFromCoordinates = async(lng,lat)=>{
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json()

        const city = data.address.city || data.address.town || data.address.village;

        return city || null;
    } catch (error) {
        console.log("Error fetching city",error)
        return null;
    }
}