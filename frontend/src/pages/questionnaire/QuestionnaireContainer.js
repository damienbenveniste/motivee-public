
import { Box, Stack, Typography } from '@mui/material'
import useUser from "hooks/useUser"
import QuestionnaireForm from 'components/questionnaire/QuestionnaireForm'


export default function QuestionnaireContainer() {
    const [user, isLoading] = useUser()

    return <Box
        display="flex"
        flexDirection='column'
        justifyContent="center"
        sx={{
            padding: 3,
            overflow: 'auto',
            height: '90vh'
        }}>
        <Stack spacing={4} alignItems='center' justifyContent='center'>
            <Typography variant='h5'>
                Tell us more about yourself
            </Typography>
            <Typography align='center'>
                Only you will be able to see this information.
                Demographics will be used in aggregate to understand
                and better serve the needs of specific groups.
            </Typography>
            {!isLoading &&
                user &&
                <QuestionnaireForm user={user} />}
        </Stack>
    </Box>
}