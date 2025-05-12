import UnaryView from 'pages/claims/claim-tree/UnaryView'
import BinaryView from 'pages/claims/claim-tree/BinaryView'


export default function MultipleClaimsView({openEnded, ...props}) {

    if (!props.claims) return null

    if (openEnded) {
        return <UnaryView {...props}/>
    } else {
        const proClaims = props.claims.filter(claim => claim.type === 'PRO')
        const conClaims = props.claims.filter(claim => claim.type === 'CON')
        return <BinaryView {...props}
            proClaims={proClaims}
            conClaims={conClaims} />
    }
}