import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { ProjectType } from '../../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons';
import ProjectItem from './components/ProjectItem';
import '../../index.css';

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [projectList, setProjectList] = useState<ProjectType[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        // Implement search functionality here
    }

    useEffect(() => {
        async function fetchList() {
            setIsLoading(true);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`);

                if (!response.ok) {
                    throw new Error('Unable to fetch projects.');
                }

                const data = (await response.json()) as ProjectType[];
                setProjectList(data);
            } catch (error) {
                console.log(error);
                setErrorMessage('Unable to load projects from the API.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchList();
    }, []);

    return (
        <>
            <h1 data-testid="page-header">Projects</h1>

            {isLoading && <p>Loading...</p>}

            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            <div className="flex">

                <form className="flex-1 w-full flex" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search Projects"
                        className="input-default"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <div className="flex-1 flex justify-end">
                    <button className="cursor-pointer h-full aspect-square">
                        <FontAwesomeIcon icon={faArrowUpAZ} size="lg" />
                    </button>
                </div>
            </div>

            <div className="container-default min-h-0 flex-1 flex flex-col gap-4 overflow-y-auto">
                {projectList.length === 0 && !isLoading && <p>No projects found.</p>}
                {projectList
                    .filter((project) =>
                        project.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((project) => (
                        <ProjectItem key={project.id} project={project} />
                    ))}
            </div>

            <div className="flex justify-end">
                <Link to={`/create-project`} className="button-primary">
                    New Project
                </Link>
            </div>
        </>
    );
};

export default HomePage;
