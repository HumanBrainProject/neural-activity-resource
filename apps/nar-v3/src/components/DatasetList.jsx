


function DatasetList(props) {

    return <ul>
        {props.datasets.map((dataset) => (
            <li key={dataset.id}>{dataset.fullName || dataset.isVersionOf.fullName}</li>
        ))}
    </ul>;
}

export default DatasetList;