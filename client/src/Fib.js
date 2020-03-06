import React, { Component} from "react";
import axios from 'axios';

class Fib extends Component {
    state = {
      seenIndexes: [],
      values: {},
      index: ''
    };

    componentDidMount() {
        setInterval(() => {
            this.fetchValues();
            this.fetchIndexes();
        }, 1000)
    }

    async fetchValues() {
        // get values from api through axios
        const values = await axios.get('/api/values/current');
        this.setState({values: values.data });
    }

    async fetchIndexes() {
        const seenIndexes = await axios.get('/api/values/all');
        this.setState({
            seenIndexes: seenIndexes.data
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({index: ''});
    };

    /* weergeef de indexen*/
    renderSeenIndexes() {
        return this.state.seenIndexes.map(({number}) => number).join(', ');
    }

    /* weergeef de values*/
    renderValues() {
        const entries = [];

        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    INDEX: {key} F-number: {this.state.values[key]}
                </div>
            );
        }
    return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Voer de index in:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value})}
                    />
                    <button>Bereken</button>
                </form>

                <h3>Indexen die berekend zijn (staan in postgres)</h3>
                {this.renderSeenIndexes()}
                <h3>Berekende waardes (staan in redis)</h3>
                {this.renderValues()}

            </div>
        )
    }
}

export default Fib;
