import { useEffect, useState } from 'react';
import './EventsAttended.css';
import { collection, doc, getDoc, getDocs, updateDoc} from 'firebase/firestore';
import { db } from './firebase';

function EventsAttended({email, cabinet})
{
    const [gbmEvents, setGbm] = useState([]);
    const [programmingEvents, setProgramming] = useState([]);
    const [mlpFallEvents, setMlpFall] = useState([]);
    const [mlpSpringEvents, setMlpSpring] = useState([]);
    const [opaEvents, setOpa] = useState([]);
    const [cabinetEvents, setCabinet] = useState([]);
    const [otherEvents, setOther] = useState([]);
    const [missedEvents, setMissed] = useState([]);

    useEffect(() => {
        const fetchAttended = async () => {
            if(email === null) return;

            // //Fetch user data
            // const userDocRef = doc(db, "users", email);
            // const userDocSnap = await getDoc(userDocRef);
            
            // //Fetch event code data
            // const codesCollectionRef = collection(db, "codes");
            // const codesDocSnap = await getDocs(codesCollectionRef);
            //Fetch user data
            const userDocRef = collection(db, "users");
            const userDoc = await getDocs(userDocRef);
            
            //Fetch event code data
            const codesCollectionRef = collection(db, "codes");
            const codesDocSnap = await getDocs(codesCollectionRef);
            var eligibleTotal = 0;
            var fifty = 0;
            var fourty = 0;
            var thirty = 0;
            var twenty = 0;
            var ten = 0;
            var zero = 0;
            var people = "";
            userDoc.forEach((userDocSnap) => 
            {
                const data = userDocSnap.data();
                var attended = data.eventCodes;
                var gbm = 0;
                var programming = 0;
                var mlpFall = 0;
                var mlpSpring = 0;
                
                codesDocSnap.forEach((doc) => {
                    attended.forEach(code => {
                        if(doc.data().voterEligible && code === doc.id)
                        {
                            const docData = doc.data();
                            if(docData.category === "GBM")
                            {
                                gbm++;
                            } else if(docData.category === "Programming" || docData.category === "OPA") {
                                programming++;
                            } else if(docData.category === "MLP Fall") {
                                mlpFall++;
                            } else if(docData.category === "MLP Spring") {
                                mlpSpring++;
                            } 
                            return;
                        }
                     })
                })
                gbm = gbm/8*100;
                programming = programming/12*100;
                mlpFall = mlpFall/2*50;
                mlpSpring = mlpSpring/2*50;
                var total = gbm+programming+mlpFall+mlpSpring;
                total = Math.round(total);
                if(total >= 60)
                {
                    people += userDocSnap.data().firstName + " " + userDocSnap.data().lastName +'\n' ;
                    eligibleTotal++;
                } else if (total >= 50) {

                    fifty++;
                } else if (total >= 40) {
                    fourty++;
                } else if (total >= 30) {
                    thirty++;
                } else if (total >= 20) {
                    twenty++;
                } else if (total >= 10) {
                     
                     ten++;
                } else {
                   
                    zero++;
                }
                // //Update state
                // setGbm(gbm);
                // setProgramming(programming);
                // setMlpFall(mlpFall);
                // setMlpSpring(mlpSpring);
                // setOpa(opa);
                // setOther(other);
                // setCabinet(cabinet);
                // setMissed(missed);

                // updateDoc(userDocRef, {
                //     unexcusedEvents: missedCodes
                // });
                // if(cabinet.length !== 0 && excusedReasons !== null)
                // {
                //     let tableData = "";
                //     console.log(cabinet);
                //     for(let i = 0; i < excusedEvents.length; i++)
                //     {
                    
                //         //Find the event data 
                //         let currentEventId = excusedEvents[i];
                //         let excusedIndex = excusedCodes.indexOf(currentEventId);
                //         let currentExcusedDoc = excused[excusedIndex];
                //         if(excusedReasons[i] === undefined)
                //         {
                //             excusedReasons[i] = "N/A";
                //         }
                //         tableData += "<tr>";
                //         tableData += "<td>" + currentExcusedDoc.data().event + "</td>";
                //         tableData += "<td>" + currentExcusedDoc.data().eventDate + "</td>";
                //         tableData += "<td>" + currentExcusedDoc.data().category + "</td>";
                //         tableData += "<td>" + currentExcusedDoc.data().points + "</td>";
                //         tableData += "<td>" + excusedReasons[i] + "</td>";
                //         tableData += "</tr>";
                //     }
                //     document.getElementById("excusedTableData").innerHTML = tableData;
                // }
             })
             console.log(people);
             console.log("eligible: " + eligibleTotal);
             console.log("fifty: " + fifty);
             console.log("fourty: " + fourty);
             console.log("thirty: " + thirty);
             console.log("twenty: " + twenty);
             console.log("ten: " + ten);
             console.log("zero: " + zero);

        };
        fetchAttended();
    }, [email, cabinet]);
    return (
        <div id='EventsAttended'>
            <h2>Events Attended</h2>
            <p style={{textAlign:'center'}}>If a table is blank, that means you have not attended an event in that category</p>
            <hr/>
            <h3>GBM</h3>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Event Date</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {gbmEvents.map((event, index) => (
                        
                        <TableRow
                            key = {index}
                            event = {event}
                        />
                    ))}
                </tbody>
            </table>

            <h3>Programming</h3>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Event Date</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {programmingEvents.map((event, index) => (
                        
                        <TableRow
                            key = {index}
                            event = {event}
                        />
                    ))}
                </tbody>
            </table>

            <h3>OPA</h3>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Event Date</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {opaEvents.map((event, index) => (
                        
                        <TableRow
                            key = {index}
                            event = {event}
                        />
                    ))}
                </tbody>
            </table>

            <h3>MLP Fall</h3>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Event Date</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {mlpFallEvents.map((event, index) => (
                        
                        <TableRow
                            key = {index}
                            event = {event}
                        />
                    ))}
                </tbody>
            </table>

            <h3>MLP Spring</h3>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Event Date</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {mlpSpringEvents.map((event, index) => (
                        
                        <TableRow
                            key = {index}
                            event = {event}
                        />
                    ))}
                </tbody>
            </table>
    
            <h3>Other</h3>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Event Date</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {otherEvents.map((event, index) => (
                        
                        <TableRow
                            key = {index}
                            event = {event}
                        />
                    ))}
                </tbody>
            </table><br/>

            {cabinet && (
                <div>
                    <h3>Cabinet</h3>
                    <p style={{textAlign:'center'}}>Please remember, cabinet points do not count towards the total points</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Event Date</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cabinetEvents.map((event, index) => (
                                
                                <TableRow
                                    key = {index}
                                    event = {event}
                                />
                            ))}
                        </tbody>
                    </table>
                    <h3>Unexcused Absenses</h3>
                    <p style={{textAlign:'center'}}>These are required events you missed</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Event Date</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {missedEvents.map((event, index) => (
                                <TableRow
                                    key = {index}
                                    event = {event}
                                />
                            ))}
                        </tbody>
                    </table><br/>
                    <h3>Excused Absenses</h3>
                    <p style={{textAlign:'center'}}>These are required events you missed</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Event Date</th>
                                <th>Event Category</th>
                                <th>Points</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody id="excusedTableData">
                            
                        </tbody>
                    </table><br/>
                </div>
            )}
            <br/><br/><br/>
        </div>
    );
}

const TableRow = ({event}) => {
    return (
        <tr>
            <td>{event.data().event}</td>
            <td style={{textAlign:'center'}}>{event.data().eventDate}</td>
            <td style={{textAlign:'center'}}>{event.data().points}</td>
        </tr>
    );
}

export default EventsAttended;