import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../theme/ThemeContext';
import api from '../api/config';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
    const [groups, setGroups] = useState([]);
    const [studentsByGroup, setStudentsByGroup] = useState({});
    const [loading, setLoading] = useState(true);
    const [newGroupName, setNewGroupName] = useState('');
    const [newStudentNames, setNewStudentNames] = useState({}); // { groupId: 'studentName' }

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await api.get('/groups');
            setGroups(res.data);
            res.data.forEach(group => fetchStudents(group._id));
        } catch (e) {
            console.error('Failed to fetch groups', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async (groupId) => {
        try {
            const res = await api.get(`/students/group/${groupId}`);
            setStudentsByGroup(prev => ({ ...prev, [groupId]: res.data }));
        } catch (e) {
            console.error(`Failed to fetch students for group ${groupId}`, e);
        }
    };

    const addGroup = async () => {
        if (!newGroupName.trim()) return;
        try {
            const res = await api.post('/groups', { name: newGroupName });
            setGroups([...groups, res.data]);
            setNewGroupName('');
        } catch (e) {
            Alert.alert('Error', 'Failed to add group');
        }
    };

    const addStudent = async (groupId) => {
        const studentName = newStudentNames[groupId];
        if (!studentName || !studentName.trim()) return;
        try {
            const res = await api.post('/students', { name: studentName, groupId });
            setStudentsByGroup(prev => ({
                ...prev,
                [groupId]: [...(prev[groupId] || []), res.data]
            }));
            setNewStudentNames(prev => ({ ...prev, [groupId]: '' }));
        } catch (e) {
            Alert.alert('Error', 'Failed to add student');
        }
    };

    const updateLessons = async (groupId, studentId, amount) => {
        try {
            const res = await api.put(`/students/${studentId}`, { amount });
            setStudentsByGroup(prev => ({
                ...prev,
                [groupId]: prev[groupId].map(s => s._id === studentId ? res.data : s)
            }));
        } catch (e) {
            Alert.alert('Error', 'Failed to update lessons');
        }
    };

    const handleAddLessons = (groupId, studentId) => {
        let inputAmount = "1";
        // In a real mobile app, we would use a modal or prompt here.
        // For React Native Web, window.prompt is an easy native-feeling fallback
        const result = window.prompt("Enter number of lessons to add:", "1");
        if (result !== null && !isNaN(parseInt(result)) && parseInt(result) > 0) {
            updateLessons(groupId, studentId, parseInt(result));
        }
    };

    const styles = getStyles(theme);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>LessonsCounter</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                        <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} style={styles.iconButton}>
                        <Ionicons name="log-out-outline" size={24} color={theme.error} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.addGroupContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="New Group Name"
                    placeholderTextColor={theme.textSecondary}
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                />
                <TouchableOpacity style={styles.addButton} onPress={addGroup}>
                    <Text style={styles.buttonText}>Add Group</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.listContainer}>
                {groups.map(group => (
                    <View key={group._id} style={styles.groupCard}>
                        <Text style={styles.groupTitle}>{group.name}</Text>

                        <View style={styles.addStudentContainer}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 10 }]}
                                placeholder="New Student Name"
                                placeholderTextColor={theme.textSecondary}
                                value={newStudentNames[group._id] || ''}
                                onChangeText={(text) => setNewStudentNames(prev => ({ ...prev, [group._id]: text }))}
                            />
                            <TouchableOpacity style={styles.addSmallButton} onPress={() => addStudent(group._id)}>
                                <Ionicons name="add" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {studentsByGroup[group._id]?.map(student => (
                            <View key={student._id} style={styles.studentCard}>
                                <View style={styles.studentInfo}>
                                    <Text style={styles.studentName}>{student.name}</Text>
                                    <Text style={styles.studentLessons}>Lessons: {student.lessonsCount}</Text>
                                </View>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: theme.primary }]}
                                        onPress={() => handleAddLessons(group._id, student._id)}
                                    >
                                        <Text style={styles.actionButtonText}>+ N</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: theme.error }]}
                                        onPress={() => updateLessons(group._id, student._id, -1)}
                                    >
                                        <Text style={styles.actionButtonText}>- 1</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
                {groups.length === 0 && (
                    <Text style={styles.emptyText}>No groups found. Create one to get started!</Text>
                )}
            </ScrollView>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.primary,
    },
    addGroupContainer: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: theme.surface,
        color: theme.text,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.border,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addSmallButton: {
        backgroundColor: theme.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
        padding: 10,
    },
    groupCard: {
        backgroundColor: theme.surface,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    groupTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text,
        marginBottom: 15,
    },
    addStudentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    studentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.background,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.border,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.text,
    },
    studentLessons: {
        fontSize: 14,
        color: theme.textSecondary,
        marginTop: 5,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.textSecondary,
        marginTop: 40,
        fontSize: 16,
    }
});
