import { useState, useEffect } from "react";

export default function Index() {

    const [leftNum, setLeftNum] = useState(0);
    const [rightNum, setRightNum] = useState(0);
    const [total, setTotal] = useState(0);

    // useEffect(() => {
    //    setTotal(leftNum + rightNum) 
    // }, [leftNum, rightNum]);

    const addNums = () => {
        setTotal(leftNum + rightNum);
    }

    return (
        <div style={{ marginTop: 30, display: 'flex', flexGrow: '1', flexDirection: 'column' }}>
            <h3>Test page</h3>
            <input style={{ width: 150, marginTop: 10 }} value={leftNum} onChange={e => setLeftNum(parseInt(e.target.value))} />
            <input style={{ width: 150, marginTop: 10 }} value={rightNum} onChange={e => setRightNum(parseInt(e.target.value))} />
            <button style={{ width: 150, marginTop: 10 }} onClick={addNums}>add nums</button>

            <p>total: {leftNum} + {rightNum} = {total}</p>
        </div>
    );
}