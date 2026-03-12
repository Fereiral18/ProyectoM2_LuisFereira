export const createAuthor = async (req, res) => {
    const { name, email, bio } = req.body;
    try {
        const result = await query(
            'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
            [name, email, bio]
        );
        res.status(201).json(result.rows);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno' });
    }
};