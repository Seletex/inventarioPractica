import {useEffect,useState} from "react";

export const Home = () => {

    const [user,setUser] = useState([]);

    const getUser = async () => {
        try {
            const url = 'https://jsonplaceholder.typicode.com/users';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            const data = await response.json();
                        return data;
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };
            
                useEffect(() => {
                    getUser()
                        .then((data) => { if (data) setUser(data); })
                        .catch((error) => { console.error('Error:', error); })
                        .finally(() => {
                            console.log('Fetch completed');
                        });
                }, [setUser]);
    return(
        <div className="home">
            <h1>Bienvenido al Sistema de Inventario</h1>
            <p>Gestiona tus equipos de manera eficiente y sencilla.</p>
            {
                user.map(user => (
                    <div key={user.id}>
                        <img src={user.avatar} alt={user.name} />
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <p>{user.phone}</p>    
                    </div>
            ))
            }
            
        </div>
    )
}