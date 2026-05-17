


export interface Props {
   
    onExport: (format:'json' | 'ssh') => void;
  
   
}

export default function ModalExport({ onExport}:Props){

   

    return (
        <div>

            <h1>Export JSON SSH</h1>
            <button onClick={() => onExport('json')}>Exportar formato JSON</button>



        </div>

    );

}