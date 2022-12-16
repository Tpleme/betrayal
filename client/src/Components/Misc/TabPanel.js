export default function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={value !== index ? { height: 'auto', display: 'flex', justifyContent: 'center' } : { height: '100%', display: 'flex', justifyContent: 'center' }}
            {...other}
        >
            {value === index && (
                children
            )}
        </div>
    );
}