import Slider, { Range } from 'rc-slider';
import React from 'react';

export const TcombInputRange = ({ onChange, config, value, label }) => {
    function _onChange([value]) {
        onChange(value);
    }

    const WithTooltip = Slider.createSliderWithTooltip(Slider);

    if (typeof label === 'function')
        label = label(value);

    return <div className="form-group form-group-depth-1">
        <label>{label} {value}</label>
        <WithTooltip
            label={label}
            min={config.min}
            max={config.max}
            step={0.05}
            defaultValue={+value}
            tipFormatter={value => `${value}%`}
            onAfterChange={onChange}
        />
    </div>
};