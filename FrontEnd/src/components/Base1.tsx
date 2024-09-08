import React, { useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment, incrementByAmount} from "@src/Store/Slinces/counterSlice.ts";



const Base1 : React.FC = () => {
    const count = useSelector((state: any) => state.counter.value);
    const dispatch = useDispatch();
    useEffect(() => {
        // checkToken()
    }, []);

    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
        </div>
    )
}

export default Base1