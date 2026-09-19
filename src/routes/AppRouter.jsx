import { createBrowserRouter } from "react-router";
import { RegisterContent } from "@/pages/registerPage";
import { LogInContent } from "@/pages/loginPage";
import ProfilePage from "@/pages/profilePage";
import ExplorePage from "@/pages/explorePage";
import CommunityPage from "@/pages/communityPage";
import TripDetailPage from "@/pages/trips-detail/tripDetailPage";
import CreateTripPage from "@/pages/createTripPage";
import NotificationPage from "@/pages/NotificationPage";
import EditProfilePage from "@/pages/editProfilePage";
import SaveTripPage from "@/pages/saveTripPage";
import CreatePostPage from "@/pages/create-post/CreatePostPage";
import MainPage from "@/pages/main/mainPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainPage,
  },

  {
    path: "/register",
    Component: RegisterContent,
  },

  {
    path: "/login",
    Component: LogInContent,
  },

  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/profile/:userId",
    Component: ProfilePage,
  },

  {
    path: "/",
    children: [
      {
        path: "explore",
        Component: ExplorePage,
      },
      {
        path: "community",
        Component: CommunityPage,
      },
    ],
  },
  {
    path: "/trip-detail/:tripId",
    Component: TripDetailPage,
  },

  {
    path: "/create-trip",
    Component: CreateTripPage,
  },

  {
    path: "/notification",
    Component: NotificationPage,
  },

  {
    path: "/edit-profile",
    Component: EditProfilePage,
  },

  {
    path: "/save-trip",
    Component: SaveTripPage,
  },
  {
    path: "/create-post",
    Component: CreatePostPage,
  },
]);

export default router;
