import React from 'react'
import Autosuggest from 'react-autosuggest'
import AutosuggestHighlightMatch from "autosuggest-highlight/umd/match";
import AutosuggestHighlightParse from "autosuggest-highlight/umd/parse";

import autosuggestContent from '../sample_suggestions';


function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('\\b' + escapedValue, 'i');

    return autosuggestContent.filter(person => regex.test(getSuggestionValue(person)));
}

function getSuggestionValue(suggestion) {
    return `${suggestion.value}`;
}

function renderSuggestion(suggestion, { query }) {
    const suggestionText = `${suggestion.value}`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    return (
        <span className={'suggestion-content ' + suggestion.hierarchyLevel}>
            <span className="name">
                {
                    parts.map((part, index) => {
                        const className = part.highlight && 'highlight';

                        return (
                            <span className={className} key={index}>{part.text}</span>
                        );
                    })
                }
            </span>
        </span>
    );
}

export default class AutosuggestComponent extends React.Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: []
        };
    }

    onChange = (event, { newValue, method }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Category",
            value,
            onChange: this.onChange
        };

        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}






