import { Menubar } from 'primereact/menubar';
const Navegacion = () => {
    const navlist = [
        { label: 'Principal', icon: 'pi pi-home', command: () => { console.log('Home clicked'); } },
        { label: 'Acerca de ', icon: 'pi pi-info', command: () => { console.log('About clicked'); } },
        { label: 'Contacto', icon: 'pi pi-envelope', command: () => { console.log('Contact clicked'); } }
    ];

    return(
        <div>
           <header>
              <nav>
                <ul>

                <Menubar model={navlist}/>

                </ul>
              </nav>
           </header>
        </div>
    )
}

export default Navegacion;