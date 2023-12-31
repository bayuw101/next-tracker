'use client'
import { Skeleton } from '@/app/components'
import { Issue, User } from '@prisma/client'
import { Select } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
    const { data: users, error, isLoading } = useUsers();

    if (isLoading) return <Skeleton height="2rem" />

    const assignIssue = (userId: string) => {
        axios.patch('/api/issues/' + issue.id, {
            assignedToUserId: userId === 'unassigned' ? null : userId
        }).catch(() => {
            toast.error('Changes could not be saved.');
        })
    }

    return (
        <>
            <Select.Root onValueChange={assignIssue} defaultValue={issue.assignedToUserId ? issue.assignedToUserId : 'unassigned'}>
                <Select.Trigger placeholder='Assign...' />
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Suggestion</Select.Label>
                        <Select.Item value="unassigned">Unassigned</Select.Item>
                        {users?.map(user => (
                            <Select.Item value={user.id} key={user.id}>{user.name}</Select.Item>
                        ))}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <Toaster />
        </>

    )
}

const useUsers = () => useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then(res => res.data),
    staleTime: 60 * 1000, //60 seconds
    retry: 3
});

export default AssigneeSelect