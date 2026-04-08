import { memo, useRef } from "react";

const OtpInput = ({ length = 6, onChange, value = "" }) => {
    const inputsRef = useRef([]);
const handleChange = (e,index)=>{
    const val = e.target.value.replace(/[^0-9]/g, "");
    if(!val) return ;
    const newOtp = value.substring(0,index)+val+value.substring(index+1);
    onChange(newOtp);
    if(index <length-1){
        inputsRef.current[index+1].focus();
    }
};

const handleKeydown =(e,index)=>{
    if(e.key==="Backspace"){
        if(value[index]){
            const newOtp = value.substring(0,index)+""+value.substring(index+1);
            onChange(newOtp);
        }else if(index>0){
            inputsRef.current[index-1].focus();
        }
    }
};
    return (
        <div className="flex justify-center flex-wrap gap-2">
            {Array.from({ length }).map((_, index) => (
                <input
                    type="text"
                    key={index}
                    maxLength={1}
                    value={value[index] || ""}
                    className="w-10 h-12 text-center border rounded-xl text-lg font-semibold focus:ring-2 focus:ring-black focus:border-black outline-none transition-all shadow-sm"
                    ref={(el) => (inputsRef.current[index] = el)}
                    onKeyDown={(e) => handleKeydown(e, index)}
                    onChange={(e) => handleChange(e, index)}
                />
            ))}
        </div>
    );
};

export default memo(OtpInput);
