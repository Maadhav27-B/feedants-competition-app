import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { CompetitionDetailsScreen } from './src/screens/CompetitionDetailsScreen';
import { CompetitionListScreen } from './src/screens/CompetitionListScreen';
import { LoginModal } from './src/screens/LoginModal';
import { competitionService } from './src/services/apiService';

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState('details'); // Default to details view
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    loadFirstCompetition();
  }, []);

  const loadFirstCompetition = async () => {
    try {
      const res = await competitionService.getCompetitions();
      if (res.success && res.data.length > 0) {
        setSelectedCompetitionId(res.data[0]._id);
      }
    } catch (e) {
      console.warn('Could not load initial competition list', e);
    }
  };

  const handleSelectCompetition = (id) => {
    setSelectedCompetitionId(id);
    setCurrentScreen('details');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'details' && selectedCompetitionId ? (
        <CompetitionDetailsScreen
          competitionId={selectedCompetitionId}
          onBack={() => setCurrentScreen('list')}
          onNavigateToList={() => setCurrentScreen('list')}
        />
      ) : (
        <CompetitionListScreen
          onSelectCompetition={handleSelectCompetition}
          onOpenLogin={() => setLoginModalVisible(true)}
        />
      )}

      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC'
  }
});
