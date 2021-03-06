import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import OutputDisplay from './OutputDisplay';
import ExperienceFields from './ExperienceFields';

const levels = Array.from(new Array(99), (v, i) => ({ value: (i + 1), label: (i + 1) }));

const levelToXPNeeded = level => 25 * (level + 3);

const calculate = (xpToAdd, currentLevel, luckyEgg) => {
    if (luckyEgg) xpToAdd = xpToAdd * 1.5;
    const xpToNextLevel = levelToXPNeeded(currentLevel);
    if (xpToAdd < xpToNextLevel) {
        return { nextLevel: currentLevel, remainingXP: xpToAdd };
    } else if (xpToAdd === xpToNextLevel) {
        return { nextLevel: currentLevel + 1, remainingXP: 0 };
    }
    let remainingXP = xpToAdd - xpToNextLevel; // 50
    if (remainingXP < xpToNextLevel) {
        return { nextLevel: currentLevel + 1, remainingXP };
    } else {
        return calculate(remainingXP, currentLevel + 1);
    }
}

class Calculator extends React.Component {
    constructor() {
        super();
        console.log();
        this.state = {
            level: '',
            newXP: '',
            output: {
                remainingXP: '',
                nextLevel: ''
            },
            luckyEgg: false,
            xpShare: false
        }
    }
    updateLevel = (e) => {
        if (e === null) {
            this.setState({ level: '', output: { nextLevel: null }});
            return;
        }
        this.setState({ level: e.value, output: calculate(this.state.newXP, e.value, this.state.luckyEgg) });
    }
    updateNewXP = (total) => {
        const newXP = parseInt(total, 10);
        if (isNaN(newXP)) {
            this.setState({ newXP: 0, output: calculate(0, this.state.level, this.state.luckyEgg) });
            return;
        }
        this.setState({ newXP, output: calculate(newXP, this.state.level, this.state.luckyEgg) });
        if (this.state.xpShare) {
            this.setState({ sharedXP: newXP / 2 });
        }
    }
    updateLuckyEgg = (e) => {
        this.setState({ luckyEgg: e.target.checked, output: calculate(this.state.newXP, this.state.level, e.target.checked) });
    }
    updateXPShare = (e) => {
        this.setState({ xpShare: e.target.checked, output: calculate(this.state.newXP, this.state.level, this.state.luckyEgg), sharedXP: e.target.checked ? this.state.newXP / 2 : 0 });
    }
    render() {
        return (
            <div className='calculator-container'>
                <div className='field'>
                    <label className='label'>Current Level</label>
                    <div className='control'>
                        <VirtualizedSelect
                            multi={false}
                            value={this.state.level}
                            options={levels}
                            onChange={this.updateLevel}
                        />
                    </div>
                </div>
                <div className='field'>
                    <label className='label'>New Experience</label>
                    {/*  */}
                    <ExperienceFields updateNewXP={this.updateNewXP} />
                </div>
                <div className='field'>
                    <div className='control'>
                        <label className='label'>
                            <input className='checkbox xpCheckbox' type='checkbox' value={this.state.luckyEgg} onChange={this.updateLuckyEgg} />
                            Lucky Egg
                        </label>
                    </div>
                </div>
                <div className='field'>
                    <div className='control'>
                        <label className='label'>
                            <input className='checkbox xpCheckbox' type='checkbox' value={this.state.xpShare} onChange={this.updateXPShare} />
                            Experience Share
                        </label>
                    </div>
                </div>
                <br /><br />
                <OutputDisplay nextLevel={this.state.output.nextLevel} remainingXP={this.state.output.remainingXP} xpNeeded={levelToXPNeeded(this.state.output.nextLevel)} sharedXP={this.state.sharedXP}/>
            </div>
        )
    }
}


export default Calculator;
