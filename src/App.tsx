// ЗАДАЧА:
// Создать мини-приложение, где есть форма, в которой
// текстовый инпут и селект.
// Из селекта можно выбрать тип: "user" или "repo".
//
// В зависимости от того, что выбрано в селекте,
// при отправке формы приложение делает запрос
// на один из следующих эндпоинтов:
//
// https://api.github.com/users/${nickname}
// пример значений: defunkt, ktsn, jjenzz, ChALkeR, Haroenv
//
// https://api.github.com/repos/${repo}
// пример значений: nodejs/node, radix-ui/primitives, sveltejs/svelte
//
// после чего, в списке ниже выводится полученная информация;
// - если это юзер, то его full name и число репозиториев;
// - если это репозиторий, то его название и число звезд.

// ТРЕБОВАНИЯ К ВЫПОЛНЕНИЮ:
// - Типизация всех элементов.
// - Выполнение всего задания в одном файле App.tsx, НО с дроблением на компоненты.
// - Стилизовать или использовать UI-киты не нужно. В задаче важно правильно выстроить логику и смоделировать данные.
// - Задание требуется выполнить максимально правильным образом, как если бы вам нужно было, чтобы оно прошло код ревью и попало в продакшн.

// Все вопросы по заданию и результаты его выполнения присылать сюда - https://t.me/temamint

import React, { useState } from 'react';
import './App.css';

type SelectOption = 'user' | 'repo';

interface User {
    fullName: string;
    publicRepos: number;
}

interface Repo {
    name: string;
    stargazersCount: number;
}

const App: React.FC = () => {
    const [nickname, setNickname] = useState<string>('');
    const [type, setType] = useState<SelectOption>('user');
    const [result, setResult] = useState<User | Repo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value as SelectOption);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            const response = await fetch(
                type === 'user'
                    ? `https://api.github.com/users/${nickname}`
                    : `https://api.github.com/repos/${nickname}`
            );

            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const data = await response.json();

            if (type === 'user') {
                setResult({
                    fullName: data.name,
                    publicRepos: data.public_repos,
                } as User);
            } else {
                setResult({
                    name: data.name,
                    stargazersCount: data.stargazers_count,
                } as Repo);
            }
        } catch (err) {
            setError('Failed to fetch data. Please check the input and try again.');
        }
    };

    return (
        <div className="App">
            <h2>Тестовое задание</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Никнейм/Репозиторий:
                        <input
                            type="text"
                            value={nickname}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Тип:
                        <select value={type} onChange={handleSelectChange}>
                            <option value="user">User</option>
                            <option value="repo">Repo</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Отправить</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && type === 'user' && (
                <div>
                    <h3>User Info:</h3>
                    <p>Full Name: {(result as User).fullName}</p>
                    <p>Number of Public Repos: {(result as User).publicRepos}</p>
                </div>
            )}
            {result && type === 'repo' && (
                <div>
                    <h3>Repo Info:</h3>
                    <p>Repo Name: {(result as Repo).name}</p>
                    <p>Number of Stars: {(result as Repo).stargazersCount}</p>
                </div>
            )}
        </div>
    );
};

export default App;
