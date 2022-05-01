import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

interface BackendIndexResponse {
    path: string;

}

const PageOk = (props: any) => {
    const [state, updateState] = useState<BackendIndexResponse[]>([]);
    useEffect(() => {
        const url = 'http://localhost:3000/'; // this is browser to server, thus localhost
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                updateState(data);
            } catch (e) {
                console.log("error: ", e);
            }
        };
        fetchData();
    }, [])

    return (
        <main>
            <h1>Page 200 status</h1>
            <p>Backend endpoints:</p>
            <ul>
                {state && state.map((e, idx) => <li key={idx}>{e.path}</li>)}
            </ul>
        </main>
    )
}


export default withRouter(PageOk);