import db from '../config/database.js';

class TimeBlockController {
  // POST /api/time-blocks - Create new time block
  static async createTimeBlock(req, res) {
    try {
      console.log('📝 Creating time block with data:', req.body);
      
      const {
        block_date,
        block_time,
        reason,
        duration = 60,
        created_by = 'admin'
      } = req.body;

      // Basic validation
      if (!block_date || !block_time || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: block_date, block_time, reason'
        });
      }

      // Check if time block already exists for this date/time
      const [existingBlocks] = await db.execute(
        'SELECT id FROM time_blocks WHERE block_date = ? AND block_time = ?',
        [block_date, block_time]
      );

      if (existingBlocks.length > 0) {
        return res.status(400).json({
      success: false,
          message: 'Time block already exists for this date and time'
        });
      }

      // Insert new time block
      const [result] = await db.execute(
        `INSERT INTO time_blocks (block_date, block_time, reason, duration, created_by, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [block_date, block_time, reason, duration, created_by]
      );

      console.log('✅ Time block created successfully with ID:', result.insertId);

      res.status(201).json({
        success: true,
        message: 'Time block created successfully',
        data: {
          id: result.insertId,
          block_date,
          block_time,
          reason,
          duration,
          created_by
        }
      });

    } catch (error) {
      console.error('TimeBlockController.createTimeBlock error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create time block'
      });
    }
  }

  // GET /api/time-blocks - Get all time blocks
  static async getAllTimeBlocks(req, res) {
    try {
      const [timeBlocks] = await db.execute(
        'SELECT * FROM time_blocks ORDER BY block_date DESC, block_time DESC'
      );

    res.json({
      success: true,
      data: timeBlocks
    });

  } catch (error) {
      console.error('TimeBlockController.getAllTimeBlocks error:', error);
    res.status(500).json({
        success: false,
        message: 'Failed to fetch time blocks'
      });
    }
  }

  // GET /api/time-blocks/date/:date - Get time blocks for specific date
  static async getTimeBlocksByDate(req, res) {
    try {
      const { date } = req.params;
      
      const [timeBlocks] = await db.execute(
        'SELECT * FROM time_blocks WHERE block_date = ? ORDER BY block_time',
        [date]
      );

      res.json({
        success: true,
        data: timeBlocks
      });

    } catch (error) {
      console.error('TimeBlockController.getTimeBlocksByDate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch time blocks for date'
      });
    }
  }

  // DELETE /api/time-blocks/:id - Delete time block
  static async deleteTimeBlock(req, res) {
  try {
    const { id } = req.params;
    
      // Check if time block exists
      const [existingBlock] = await db.execute(
        'SELECT id FROM time_blocks WHERE id = ?',
        [id]
      );

      if (existingBlock.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Time block not found'
      });
    }

      // Delete time block
      await db.execute('DELETE FROM time_blocks WHERE id = ?', [id]);

      console.log('✅ Time block deleted successfully:', id);

    res.json({
      success: true,
      message: 'Time block deleted successfully'
    });

  } catch (error) {
      console.error('TimeBlockController.deleteTimeBlock error:', error);
    res.status(500).json({
      success: false,
        message: 'Failed to delete time block'
      });
    }
  }

  // GET /api/time-blocks/check - Check if time slot is blocked
  static async checkTimeBlock(req, res) {
    try {
      const { block_date, block_time } = req.query;

      if (!block_date || !block_time) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: block_date, block_time'
        });
      }

      const [timeBlocks] = await db.execute(
        'SELECT * FROM time_blocks WHERE block_date = ? AND block_time = ?',
        [block_date, block_time]
      );
    
    res.json({
      success: true,
        isBlocked: timeBlocks.length > 0,
        data: timeBlocks.length > 0 ? timeBlocks[0] : null
    });

  } catch (error) {
      console.error('TimeBlockController.checkTimeBlock error:', error);
    res.status(500).json({
      success: false,
        message: 'Failed to check time block'
    });
    }
  }

  // GET /api/time-blocks/range - Get time blocks within date range
  static async getTimeBlocksByRange(req, res) {
  try {
      const { start_date, end_date } = req.query;
    
      if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
          message: 'Missing required parameters: start_date, end_date'
      });
    }

      const [timeBlocks] = await db.execute(
        'SELECT * FROM time_blocks WHERE block_date BETWEEN ? AND ? ORDER BY block_date, block_time',
        [start_date, end_date]
      );
    
    res.json({
      success: true,
        data: timeBlocks
    });

  } catch (error) {
      console.error('TimeBlockController.getTimeBlocksByRange error:', error);
    res.status(500).json({
      success: false,
        message: 'Failed to fetch time blocks for date range'
      });
    }
  }
}

export default TimeBlockController;
