import { Link } from '@mui/material'
import ReactMarkdown from 'react-markdown'


export default class String {

    static getLinks(string) {
        return <ReactMarkdown
            components={{
                a: props => <Link
                    href={props.href}
                    target="_blank"
                    rel="noopener noreferrer">
                    {props.children}
                </Link>
            }}
        >
            {string}
        </ReactMarkdown>
    }

}
