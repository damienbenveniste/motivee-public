
import { Grid, Typography, Stack } from '@mui/material'
import PricingPlanCard from "./PricingPlanCard"
import pricing3 from 'icons/sources/pricing3.svg'
import pricing2 from 'icons/sources/pricing2.svg'
import pricing1 from 'icons/sources/pricing1.svg'


const _pricingPlans = [
    {
        subscription: 'basic',
        icon: <img src={pricing1} alt='landing' style={{ height: 50 }} />,
        price: 0,
        captions: ['Forever'],
        description: 'For teams just getting started.',
        lists: [
            { text: 'Unlimited discussion maps', isAvailable: true },
            { text: 'Basic decision insights', isAvailable: true },
            { text: 'Personal feed', isAvailable: true },
            { text: 'Up to 5 team members', isAvailable: true },
        ],
        labelAction: 'current plan',
    },
    {
        subscription: 'Team',
        icon: <img src={pricing2} alt='landing' style={{ height: 50 }} />,
        price: 6,
        captions: ['Per user billed annually', '$8 billed monthly'],
        description: 'For managers and leaders ready to engage their teams in collaborative decisions.',
        lists: [
            { text: 'Unlimited discussion participants', isAvailable: true },
            { text: 'Decision insights and recommendations', isAvailable: true },
        ],
        labelAction: 'choose Team',
    },
    {
        subscription: 'Business',
        icon: <img src={pricing3} alt='landing' style={{ height: 50 }} />,
        price: null,
        captions: [],
        description: 'For leaders who want to use Motivee at the company level.',
        lists: [
            { text: 'Advanced insights and recommendations', isAvailable: true },
            { text: 'Advanced admin features', isAvailable: true },
        ],
        labelAction: 'choose Business',
    },
]

const frequencyDict = {
    'basic': 0,
    'team_monthly': 1,
    'team_yearly': 1
}



export default function PricingPlanView({elevation, currentPlan, ...props} ) {

    const currentPlanIndex = frequencyDict[currentPlan]

    return <Stack {...props} spacing={2}>
        <Stack>
            <Typography variant='h6'>
                Pricing Plans
            </Typography>

            <Grid container spacing={3} alignItems="stretch">
                {_pricingPlans.map((card, index) => (
                    <Grid item xs={12} md={4} key={card.subscription}>
                        <PricingPlanCard 
                        card={card} 
                        index={index} 
                        currentPlanIndex={currentPlanIndex}
                        elevation={elevation}/>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    </Stack>

}