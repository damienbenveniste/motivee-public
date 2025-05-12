import DialogIconButton from 'components/views/DialogIconButton'
import HelpIcon from '@mui/icons-material/Help'
import { Typography, Link } from '@mui/material'


const pValueHelper = <Typography align='justify'>
    The claims are ranked based on the level of "positive consensus" as measured by the votes. That level
    takes into account the amount of up-votes versus down-votes as well as the statistical significance of the
    sample size. <br /><br />

    For each claim, we perform a <Link href='https://en.wikipedia.org/wiki/Binomial_test' target="_blank" rel="noopener noreferrer">
        two-tailed binomial test</Link> where the null hypothesis represents the event where a up-vote and a down-vote are
    equality likely to happen:
    <ul>
        <li> "Consensus" is quantatively defined as the statistical test having a significance level of 0.1 (<Link href='https://en.wikipedia.org/wiki/P-value' target="_blank" rel="noopener noreferrer">
            p-value</Link> &#60; 0.1).
        </li>
        <li> "Positive consensus" indicates a low p-value with up-votes greater than down-votes. A "negative consensus" indicates a
            low p-value with up-votes lower than down-votes.
        </li>
        <li> The claims are ranked by increasing p-value when <em>up-votes &gt; down-votes</em> and by decreasing p-value when <em>up-votes &#60; down-votes</em>.
        </li>
    </ul>
</Typography>


export function PValueInformation() {
    return <DialogIconButton
        icon={<HelpIcon />}
        title='How are Claims Ranked?'
        text={pValueHelper} />
}


const summaryHelper = <Typography align='justify'>
    The summaries are generated using the top claims ranked by "positive consensus" as measured by the votes. A "support" summary is generated using "support" claims and 
    a "concern" summary is generated using "concern" claims. For each claim, we perform a <Link href='https://en.wikipedia.org/wiki/Binomial_test' target="_blank" rel="noopener noreferrer">
        two-tailed binomial test</Link> where the null hypothesis represents the event where a up-vote and a down-vote are
    equality likely to happen. For the summaries, the whole tree of claims is utilized:
    <ul>
        <li> A "support" claim to a "support" claim is considered an overall "support". A "concern" to a "concern" is considered a "support". A "concern" to a
            "support" is considered a "concern", ...etc.
        </li>
        <li> At least 10 claims are used (or less if the conversation does not have enough claims yet).
        </li>
        <li> We use the top 30% claims of the conversation as ranked by p-value of the statistical test. The claims are ranked by increasing p-value 
            when <em>up-votes &gt; down-votes</em> and by decreasing p-value when <em>up-votes &#60; down-votes</em>.
        </li>
        <li> We additionaly include all the claims with at most <em>p-value &#60; 0.1</em> to get a good overview of all the claims 
            with a positive consensus.
        </li>
    </ul>
</Typography>


export function SummaryInformation() {
    return <DialogIconButton
        icon={<HelpIcon />}
        title='How are the Summaries generated?'
        text={summaryHelper} />
}

