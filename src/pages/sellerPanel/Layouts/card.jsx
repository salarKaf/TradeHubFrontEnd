import React from "react";
import PropTypes from "prop-types";

const InfoCard = ({ 
    title, 
    subtitle, 
    logo, 
    titleColor = "text-black", 
    subtitleColor = "text-black", 
    bgColor = "bg-[#7d97ff5c]", 
    borderColor = "border-black border-opacity-20",
    titleSize = "text-3xl",
    subtitleSize = "text-lg"
}) => {
    return (
        <div className={`flex font-modam justify-around items-center p-6 rounded-xl border-2 ${borderColor} w-full max-w-[380px] flex-grow`}>
            <div>
                <h2 className={`${titleSize} font-medium ${titleColor}`}>{title}</h2>
                <p className={`${subtitleSize} font-extralight ${subtitleColor}`}>{subtitle}</p>
            </div>
            <div className={`${bgColor} rounded-lg p-1`}>
                <img src={logo} alt="card-icon" />
            </div>
        </div>
    );
};

InfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    titleColor: PropTypes.string,
    subtitleColor: PropTypes.string,
    bgColor: PropTypes.string,
    borderColor: PropTypes.string,
    titleSize: PropTypes.string,
    subtitleSize: PropTypes.string
};

export default InfoCard;