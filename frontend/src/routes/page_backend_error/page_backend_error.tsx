import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";


interface BackendDataReponse {
    firstName: string;
    lastName: string;
}

const PageBEError = (props: any) => {
    const [state, updateState] = useState<BackendDataReponse[]>([]);
    const [failed, updateFailed] = useState<undefined | boolean>(undefined);
    useEffect(() => {
        const url = 'http://localhost:3000/data'; // browser, thus localhost, not server to server
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                console.log("PageBackend_error: ", response);
                const data = await response.json();
                console.log("DATA: ", data);
                updateState(data);
            } catch (e) {
                console.log("error: ", e);
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        const url = 'http://localhost:3000/data-error';
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log("unexpected response: data-error ", data);
                updateFailed(false);
            } catch (e) {
                console.log("<Frontend> Expected error fetching data-error: ", e);
                updateFailed(true);
            }
        };
        fetchData();

    }, [state])


    const getFailedRequestStatus = () => {
        if (failed === undefined) return '';
        else return failed ? 'true' : 'false';
    }

    return (
        <main>
            <h1>PageTSError status</h1>
            <p>Data fetched: </p>
            <ul>

                {state && state.map((e, idx) => {
                    return <li key={idx}>{e.firstName} - {e.lastName}</li>
                })}
            </ul>
            <p>Request failed, as expected, somewhere in the request chain? {getFailedRequestStatus()}</p>
        </main>
    );
}

export default withRouter(PageBEError);