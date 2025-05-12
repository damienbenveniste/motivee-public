import { useState, useEffect } from 'react'
import Modal from "components/views/Modal"
import {
    Stack,
    Typography,
    Button,
    Slide
} from '@mui/material'
import productive from 'images/productive.svg'
import conversation from 'images/conversation.svg'
import conversation2 from 'images/conversation2.svg'
import speak from 'images/speak.svg'
import decision from 'images/decision.svg'


const slideTime = 250

const adminSlides = [
    {
        title: 'What am I doing here?',
        text: `
        Welcome to Motivee!
        This is your homebase for excellent decision-making and implementation research. 
        You can use Motivee to help your people feel more engaged while helping your company be more productive.
        `,
        image: productive
    },
    {
        title: 'How does it work?',
        text: 'You can create conversation topics for various groups of people in your organization.',
        image: conversation
    },
    {
        title: 'So what?',
        text: `
        From your people’s contributions to the discussions you create, 
        Motivee will show you all about how best to make and implement your decisions. 
        Go on and make it happen!
        `,
        image: decision
    },
]


const inviteeSlides = [
    {
        title: 'What am I doing here?',
        text: `
        Welcome to Motivee!
        This is your homebase for voicing your opinions on topics that matter at work. 
        It’s completely anonymous.
        `,
        image: productive
    },
    {
        title: 'How does it work?',
        text: `You can contribute to conversation topics by making suggestions, 
        voicing pros and cons, as well as upvoting and downvoting.`,
        image: conversation2
    },
    {
        title: 'So what?',
        text: `
        Your company will weigh your contributions as decisions are made 
        and executed throughout the organization. Go on and be heard! 
        `,
        image: speak
    },
]


export default function WelcomeSlideShow({ open, onClose, isAdmin }) {

    const [position, setPosition] = useState(0)
    const [randomKey, setRandomKey] = useState(Math.random())
    const [direction, setDirection] = useState('left')
    const [slideIn, setSlideIn] = useState(true)

    const slides = isAdmin ? adminSlides : inviteeSlides

    const slideComponents = slides.map((obj, index) => {
        return <Stack
            key={index}
            justifyContent='space-around'
            alignItems='center'
            spacing={3}
            sx={{ width: 600, height: 450 }}>
            <Stack spacing={2}>
                <Typography variant='h4'>
                    {obj.title}
                </Typography>
                <Typography align='justify'>
                    {obj.text}
                </Typography>
            </Stack>
            <img src={obj.image} alt='landing' style={{ width: 500, maxHeight: 250 }} />
        </Stack>
    })

    const slideLeft = () => {
        setDirection('right')
        setSlideIn(false)
        setTimeout(() => {
            setRandomKey(Math.random())
            setDirection('left')
            setSlideIn(true)
            setPosition(position + 1)
        }, slideTime / 2)
    }

    const slideRight = () => {
        setDirection('left')
        setSlideIn(false)
        setTimeout(() => {
            setRandomKey(Math.random())
            setDirection('right')
            setSlideIn(true)
            setPosition(position - 1)
        }, slideTime / 2)
    }

    const onNext = () => {
        if (position < adminSlides.length - 1) {
            slideLeft()
        } else {
            onClose()
        }
    }
    const onBack = () => {
        if (position > 0) {
            slideRight()
        }
    }

    return <Modal open={open} onClose={onClose}>
        <Slide
            key={randomKey}
            direction={direction}
            in={slideIn}
            mountOnEnter
            timeout={slideTime}
            unmountOnExit>
            {slideComponents[position]}
        </Slide>
        <Stack direction='row' justifyContent='space-between'>
            <Button
                disabled={position === 0}
                onClick={onBack}>
                back
            </Button>
            <Button
                onClick={onNext}>
                {position === adminSlides.length - 1 ? 'close': 'next'}
            </Button>
        </Stack>
    </Modal>
}