/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import Layout from "./components/Layout";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { ContentProvider } from "./context/ContentContext";

export default function App() {
  return (
    <ContentProvider>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </ContentProvider>
  );
}
