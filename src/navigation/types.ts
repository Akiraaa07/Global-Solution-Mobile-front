export type RootStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    HomeScreen: undefined;
    FeedbackScreen: undefined;
    AdicionarFeedbackScreen: undefined;
    AparelhosScreen: undefined;
    ListaAparelhosScreen: undefined;
  };

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}  