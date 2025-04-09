import { Menubar } from 'primereact/menubar';
const Navegacion = () => {
    const navlist = [
        { label: 'Home', icon: 'pi pi-home', command: () => { console.log('Home clicked'); } },
        { label: 'About', icon: 'pi pi-info', command: () => { console.log('About clicked'); } },
        { label: 'Contact', icon: 'pi pi-envelope', command: () => { console.log('Contact clicked'); } }
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